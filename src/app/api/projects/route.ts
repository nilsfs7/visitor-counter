import { ensureDatabaseInitialized, getProjectRepository } from '@/infra/db/database';
import { createProjectId } from '@/lib/id';
import { NextRequest, NextResponse } from 'next/server';
import { QueryFailedError } from 'typeorm';

const MAX_ID_RETRIES = 5;

function isDuplicateKeyError(error: unknown): boolean {
  if (!(error instanceof QueryFailedError)) {
    return false;
  }
  const driverError = error.driverError as { code?: string; errno?: number } | undefined;
  // MySQL duplicate entry
  return driverError?.code === 'ER_DUP_ENTRY' || driverError?.errno === 1062;
}

export async function GET() {
  try {
    // Ensure database is initialized
    await ensureDatabaseInitialized();

    // Get repository and store the value
    const repository = getProjectRepository();
    const entities = await repository.find({ order: { created_at: 'DESC' } });
    const projects = entities.map(entity => {
      return { id: entity.id, name: entity.name, description: entity.description, destination: entity.destination };
    });

    return NextResponse.json({ projects, status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Ensure database is initialized
    await ensureDatabaseInitialized();
    // Parse the request body
    const body = await request.json();
    const { name, description, destination } = body;

    // Validate input
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
    }
    if (!destination || typeof destination !== 'string' || !destination.trim()) {
      return NextResponse.json({ error: 'Destination is required.' }, { status: 400 });
    }

    let destinationUrl: string;
    try {
      destinationUrl = new URL(destination.trim()).toString();
    } catch {
      return NextResponse.json({ error: 'Destination must be a valid URL.' }, { status: 400 });
    }

    const repository = getProjectRepository();
    const projectData = {
      name: name.trim(),
      description: typeof description === 'string' ? description.trim() : '',
      destination: destinationUrl,
    };

    let entity;
    for (let attempt = 0; attempt < MAX_ID_RETRIES; attempt++) {
      try {
        entity = await repository.save({
          ...projectData,
          id: createProjectId(),
        });
        break;
      } catch (error) {
        if (!isDuplicateKeyError(error) || attempt === MAX_ID_RETRIES - 1) {
          throw error;
        }
      }
    }

    if (!entity) {
      return NextResponse.json({ error: 'Could not allocate a unique project id.' }, { status: 500 });
    }

    return NextResponse.json({ payload: { url: `${process.env.NEXT_PUBLIC_SERVER_URL}?id=${entity.id}` }, status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
