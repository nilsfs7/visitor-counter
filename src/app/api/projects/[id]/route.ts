import { ensureDatabaseInitialized, getProjectRepository } from '@/infra/db/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Ensure database is initialized
    await ensureDatabaseInitialized();

    // Get repository and store the value
    const repository = getProjectRepository();
    const entity = await repository.findOne({ where: { id: request.nextUrl.pathname.split('/').pop() } });

    return NextResponse.json({ project: entity, status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
