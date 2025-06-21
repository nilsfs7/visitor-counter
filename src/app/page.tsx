import { redirect, RedirectType } from 'next/navigation';

export default async function Home(props: { searchParams: Promise<{ redir: string }> }) {
  const searchParams = await props.searchParams;
  const redir = searchParams.redir;

  // Redirect if redir parameter is provided
  if (redir) {
    console.info('Attempting to redirect to:', redir);

    // Validate that it's a proper URL
    const url = new URL(redir);
    // Only redirect if it's an external URL (has protocol)
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      console.info('Valid URL detected, redirecting to:', redir);
      redirect(url.toString(), RedirectType.replace);
    } else {
      console.error('Invalid protocol:', url.protocol);
    }
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="mt-4 p-4 bg-blue-100 border border-blue-300 rounded">
          {redir ? (
            <>
              <p>{`Redirect parameter: ${redir}`}</p>
              <p className="text-sm text-gray-600">({`Redirect should have happened automatically`})</p>
            </>
          ) : (
            <p>{`No redirect parameter`}</p>
          )}
        </div>
      </main>
    </div>
  );
}
