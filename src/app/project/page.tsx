'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { copyToClipboard } from '@/lib/helper/copy-to-clipboard';
import { Label } from '@radix-ui/react-label';

export default function Project() {
  const [counterUrl, setCounterUrl] = useState<string>();
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [destination, setDestination] = useState<string>('');

  const handleNameChanged = (value: string) => {
    setName(value);
  };

  const handleDescriptionChanged = (value: string) => {
    setDescription(value);
  };

  const handleDestinationChanged = (value: string) => {
    setDestination(value);
  };

  const handleCreateProjectClicked = async () => {
    try {
      // Validate that it's a proper URL
      const url = new URL(destination);

      const res = await fetch(`/api/project`, {
        method: 'POST',
        body: JSON.stringify({ name, description, destination: url.toString() }),
        headers: { 'Content-Type': 'application/json' },
      });

      const body = await res.json();
      setCounterUrl(body.payload.url);
    } catch (error) {
      console.error(`Invalid url "${destination}".`, error);
    }
  };

  const handleCopyClicked = async (value: string) => {
    copyToClipboard(value);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <div className="flex flex-col gap-2 p-4">
          <div>
            <Label>{`Project name`}</Label>
            <Input
              id={'input-name'}
              className="h-full w-full rounded-lg border border-secondary-dark p-1"
              placeholder={'GFFC 25'}
              value={name}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleNameChanged(event.currentTarget.value);
              }}
            />
          </div>

          <div>
            <Label>{`Description`}</Label>
            <Input
              id={'input-description'}
              className="h-full w-full rounded-lg border border-secondary-dark p-1"
              placeholder={'Track handouts'}
              value={description}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleDescriptionChanged(event.currentTarget.value);
              }}
            />
          </div>

          <div>
            <Label>{`Target URL`}</Label>
            <Input
              id={'input-name'}
              className="h-full w-full rounded-lg border border-secondary-dark p-1"
              placeholder={'https://fsmeet.com/...'}
              value={destination}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleDestinationChanged(event.currentTarget.value);
              }}
            />
          </div>

          <Button disabled={!name || !destination} onClick={handleCreateProjectClicked}>
            {'Create project'}
          </Button>
        </div>

        {counterUrl && (
          <div className="flex flex-col w-full items-center gap-2 p-4">
            <p className="text-sm">{counterUrl}</p>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  handleCopyClicked(counterUrl);
                }}
              >
                {'Copy to clipboard'}
              </Button>
              <a target="_blank" rel="noopener noreferrer" href={`${counterUrl}&test=1`}>
                <Button>{'Test link'}</Button>
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
