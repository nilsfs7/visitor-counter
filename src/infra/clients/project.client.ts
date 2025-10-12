import { Project } from '../../app/domain/types/project';

export async function getProjects(): Promise<Project[]> {
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/projects`;

  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    const body: any[] = (await response.json()).projects;

    return body.map(item => {
      return { id: item.id, name: item.name, description: item.description, destination: item.destination, created: item.created_at };
    });
  } else {
    throw Error(`Error fetching project.`);
  }
}

export async function getProject(projectId: string | null): Promise<Project> {
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/projects/${projectId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    const body = (await response.json()).project;
    return { id: body.id, name: body.name, description: body.description, destination: body.destination, created: body.created_at };
  } else {
    throw Error(`Error fetching project.`);
  }
}

export async function createProject(name: string, description: string, destination: string): Promise<string> {
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/projects`;

  const body = JSON.stringify({ name, description, destination: destination.toString() });

  const response = await fetch(url, {
    method: 'POST',
    body,
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    console.info('Creating project successful');
    return (await response.json()).payload.url;
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}
