import { supabase } from './src/lib/supabase';

async function check() {
  console.log('--- Checking SemesterGPA columns ---');
  const { data: sem, error: errSem } = await supabase.from('SemesterGPA').select('*').limit(1);
  if (errSem) console.error('SemesterGPA Error:', errSem);
  else console.log('SemesterGPA Columns:', Object.keys(sem?.[0] || {}));

  console.log('--- Checking Project columns ---');
  const { data: proj, error: errProj } = await supabase.from('Project').select('*').limit(1);
  if (errProj) console.error('Project Error:', errProj);
  else console.log('Project Columns:', Object.keys(proj?.[0] || {}));

  console.log('--- Checking WorkExperience columns ---');
  const { data: exp, error: errExp } = await supabase.from('WorkExperience').select('*').limit(1);
  if (errExp) console.error('WorkExperience Error:', errExp);
  else console.log('WorkExperience Columns:', Object.keys(exp?.[0] || {}));
}

check();
