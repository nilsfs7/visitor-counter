'use client';

import { useEffect, useState } from 'react';

export default function Init() {
  const [dbReady, setDbReady] = useState<boolean>(false);

  useEffect(() => {
    fetch(`/api/init`, { method: 'POST' }).then(() => {
      setDbReady(true);
    });
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {dbReady && (
          <div className="mt-4 p-4 bg-blue-100 border border-blue-300 rounded">
            <p>{`Database created`}</p>
          </div>
        )}
      </main>
    </div>
  );
}
