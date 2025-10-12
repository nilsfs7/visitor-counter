import { ensureDatabaseInitialized, getProjectRepository } from '@/infra/db/database';
import { NextRequest, NextResponse } from 'next/server';

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
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Name is required and must be a string' }, { status: 400 });
    }
    if (!destination || typeof destination !== 'string') {
      return NextResponse.json({ error: 'Destination is required and must be a string' }, { status: 400 });
    }

    // Get repository and store the value
    const repository = getProjectRepository();
    const entity = await repository.save({ name, description, destination });

    return NextResponse.json({ payload: { url: `${process.env.NEXT_PUBLIC_SERVER_URL}?id=${entity.id}` }, status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
