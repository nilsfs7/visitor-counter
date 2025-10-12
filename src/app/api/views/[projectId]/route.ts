import { ensureDatabaseInitialized, getViewRepository } from '@/infra/db/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Ensure database is initialized
    await ensureDatabaseInitialized();

    // Get repository and store the value
    const repository = getViewRepository();
    const entities = await repository.find({ where: { project: { id: request.nextUrl.pathname.split('/').pop() } }, order: { created_at: 'ASC' } });

    return NextResponse.json({ visits: entities, status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
