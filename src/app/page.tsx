import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { redirect, RedirectType } from 'next/navigation';

export default async function Home(props: { searchParams: Promise<{ id?: string }> }) {
  const searchParams = await props.searchParams;
  const projectId = searchParams.id;

  // Redirect if projectId parameter is provided
  if (projectId) {
    const res = await fetch(`http://localhost:${process.env.SERVER_PORT}/api/visit`, {
      method: 'POST',
      body: JSON.stringify({ projectId }),
      headers: { 'Content-Type': 'application/json' },
    });

    const body = await res.json();

    console.info('Attempting to redirect to:', body.payload.destination);
    redirect(body.payload.destination, RedirectType.replace);
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[64px] row-start-2 items-center sm:items-start">
        <div className="p-4 bg-blue-100 border border-blue-300 rounded">
          {projectId ? (
            <>
              <p>{`Project id: ${projectId}`}</p>
              <p className="text-sm text-gray-600">({`Redirect should have happened automatically`})</p>
            </>
          ) : (
            <>
              <p>{`No project id provided.`}</p>
              <p>{`Not redirecting.`}</p>
            </>
          )}
        </div>

        <div className="flex justify-center hover:underline w-full">
          <Link href={'/project'}>
            <Button>{`Create new project`}</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
