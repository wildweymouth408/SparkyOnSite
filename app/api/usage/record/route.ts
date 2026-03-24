import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { canUseCalculator, canUseAskSparky, canAttachToJob, canCreateJob } from '@/lib/usage-server';

async function getAuthenticatedUser(authHeader: string | null) {
  const supabase = createClient(
    env.supabaseUrl,
    env.supabaseAnonKey,
    authHeader ? { global: { headers: { Authorization: authHeader } } } : {}
  );
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    const user = await getAuthenticatedUser(authHeader);
    const body = await req.json();
    const { type, jobId } = body;

    if (!type || typeof type !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid type' }, { status: 400 });
    }

    let result;
    switch (type) {
      case 'calculator':
        result = await canUseCalculator(user.id, true);
        break;
      case 'ask_sparky':
        result = await canUseAskSparky(user.id, true);
        break;
      case 'job_attachment':
        if (!jobId) {
          return NextResponse.json({ error: 'Missing jobId for job_attachment' }, { status: 400 });
        }
        result = await canAttachToJob(user.id, jobId, true);
        break;
      case 'create_job':
        result = await canCreateJob(user.id);
        // canCreateJob doesn't increment usage; it's just a check
        break;
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json({
      allowed: result.allowed,
      remaining: result.remaining,
    });
  } catch (error: any) {
    console.error('Usage record error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}