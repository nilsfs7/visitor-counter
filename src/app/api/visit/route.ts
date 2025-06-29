import { ensureDatabaseInitialized, getProjectRepository, getVisitRepository } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';
import { EntityNotFoundError } from 'typeorm';

export async function POST(request: NextRequest) {
  try {
    // Ensure database is initialized
    await ensureDatabaseInitialized();

    // Parse the request body
    const body = await request.json();
    const { projectId } = body;

    // Validate input
    if (!projectId || typeof projectId !== 'string') {
      return NextResponse.json({ error: 'ProjectId is required and must be a string' }, { status: 400 });
    }

    // Get repository and store the value
    const projectRepository = getProjectRepository();
    const projectEntity = await projectRepository.findOneOrFail({
      where: { id: projectId },
    });

    const visitRepository = getVisitRepository();
    visitRepository.save({ project: projectEntity });

    return NextResponse.json({ payload: { destination: projectEntity.destination }, status: 200 });
  } catch (error) {
    if (error instanceof EntityNotFoundError) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
