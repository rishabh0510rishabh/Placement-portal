import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch all companies via HTTPS
    const { data: companies, error } = await supabase
      .from('Company')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ companies: companies || [] }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch admin companies error:', error.message);
    return NextResponse.json({ error: 'Failed to fetch company data over HTTPS' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    
    // Create new company via HTTPS
    const { data: company, error } = await supabase
      .from('Company')
      .insert({
        name: body.name,
        industry: body.industry,
        website: body.website,
        logo: body.logo,
        description: body.description,
        status: body.status || 'active'
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ company }, { status: 201 });
  } catch (error: any) {
    console.error('Create company error:', error.message);
    if (error.code === '23505') { // Postgres duplicate key error
      return NextResponse.json({ error: 'Company with this name already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create company over HTTPS' }, { status: 500 });
  }
}
