import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET /api/admin/companies - Fetch all companies
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: companies, error } = await supabase
      .from('Company')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return NextResponse.json({ companies }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch companies error:', error.message);
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}

// POST /api/admin/companies - Create a new company
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, industry, website, description } = body;

    if (!name || !industry) {
      return NextResponse.json({ error: 'Name and Industry are required' }, { status: 400 });
    }

    const { data: newCompany, error } = await supabase
      .from('Company')
      .insert({
        name,
        industry,
        website,
        description,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: 'Company created successfully', company: newCompany }, { status: 201 });
  } catch (error: any) {
    console.error('Create company error:', error.message);
    return NextResponse.json({ error: error.message || 'Failed to create company' }, { status: 500 });
  }
}
