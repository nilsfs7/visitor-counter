import { createDatabaseIfNotExists } from '@/infra/db/database';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    await createDatabaseIfNotExists();

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
