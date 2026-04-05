import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // 1. Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required.' },
        { status: 400 }
      );
    }

    // 2. Enforce RKGIT email domain for students
    const lowerEmail = email.toLowerCase();
    if (!lowerEmail.endsWith('@rkgit.edu.in')) {
      return NextResponse.json(
        { error: 'Only @rkgit.edu.in email addresses are allowed for registration.' },
        { status: 400 }
      );
    }

    // 3. Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    // 4. Check if user already exists via HTTPS (Guaranteed connection)
    const { data: existingUser } = await supabase
      .from('User')
      .select('id')
      .eq('email', lowerEmail)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    // 5. Hash password for Postgres storage
    const hashedPassword = await bcrypt.hash(password, 12);

    const now = new Date().toISOString();
    const userId = crypto.randomUUID();

    // 6. Create User Entry
    const { data: user, error: insertError } = await supabase
      .from('User')
      .insert({
        id: userId,
        name: name,
        email: lowerEmail,
        password: hashedPassword,
        role: 'student',
        createdAt: now,
        updatedAt: now,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // 7. Create corresponding StudentProfile Entry
    // This ensures the student appears in admin lists and has a profile to fill later
    const { error: profileError } = await supabase
      .from('StudentProfile')
      .insert({
        id: crypto.randomUUID(),
        userId: userId,
        fullName: name,
        email: lowerEmail,
        cgpa: 0,
        activeBacklogs: 0,
        currentSemester: 1,
        branch: 'Other', // Default
        rollNumber: 'NOT_SET',
        collegeId: 'NOT_SET',
        phoneNumber: 'NOT_SET'
      });

    if (profileError) {
      console.warn('Profile creation warning:', profileError.message);
      // We don't fail the whole registration if profile creation fails, 
      // but ideally this shouldn't happen.
    }

    return NextResponse.json(
      {
        message: 'Account created successfully over HTTPS.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error.message);
    return NextResponse.json(
      { error: 'Internal server error over HTTPS. Please try again.' },
      { status: 500 }
    );
  }
}
