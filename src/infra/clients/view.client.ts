import { View } from '../../app/domain/types/view';

export async function getViews(projectId: string | null): Promise<View[]> {
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/views/${projectId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    const body: any[] = (await response.json()).visits;

    return body.map(item => {
      return { id: item.id, created: item.created_at };
    });
  } else {
    throw Error(`Error fetching visits.`);
  }
}

export async function createView(projectId: string, isTest: boolean): Promise<string> {
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/views`;

  const body = JSON.stringify({ projectId, isTest });

  const response = await fetch(url, {
    method: 'POST',
    body,
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    console.info('Creating project successful');
    return (await response.json()).payload.destination;
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}
