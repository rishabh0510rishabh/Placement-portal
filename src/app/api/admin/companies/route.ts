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

    const now = new Date().toISOString();
    const { data: newCompany, error } = await supabase
      .from('Company')
      .insert({
        id: crypto.randomUUID(),
        name,
        industry,
        website,
        description,
        status: 'active',
        createdAt: now,
        updatedAt: now,
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

// PATCH /api/admin/companies - Update a company
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  try {
    const body = await req.json();
    const { name, industry, website, description } = body;

    const { data: updatedCompany, error } = await supabase
      .from('Company')
      .update({
        name,
        industry,
        website,
        description,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ company: updatedCompany }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/admin/companies - Delete a company
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
  }

  try {
    const { error } = await supabase
      .from('Company')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ message: 'Company deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Delete company error:', error.message);
    return NextResponse.json({ error: 'Failed to delete company' }, { status: 500 });
  }
}
