import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { redirect, RedirectType } from 'next/navigation';
import { createView } from '../infra/clients/view.client';

export default async function Home(props: { searchParams: Promise<{ id?: string; test: string }> }) {
  const searchParams = await props.searchParams;
  const projectId = searchParams.id;
  const isTest = searchParams.test === '1';

  // Redirect if projectId parameter is provided
  if (projectId) {
    const destination = await createView(projectId, isTest);

    console.info('Attempting to redirect to:', destination);
    redirect(destination, RedirectType.replace);
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

        <div className="flex flex-col items-center gap-2 w-full">
          <Link href={'/projects'}>
            <Button>{`View projects`}</Button>
          </Link>

          <Link href={'/projects/new'}>
            <Button>{`Create new project`}</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
