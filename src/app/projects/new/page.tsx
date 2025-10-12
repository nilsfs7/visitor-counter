'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import Link from 'next/link';
import { ButtonCopyToClipboard } from '../../../components/button-to-clipboard';
import { createProject } from '../../../infra/clients/project.client';

export default function NewProject() {
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

      const counterUrl = await createProject(name, description, url.toString());
      setCounterUrl(counterUrl);
    } catch (error) {
      console.error(`Invalid url "${destination}".`, error);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <div className="flex flex-col gap-2">
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
          <div className="flex flex-col w-full items-center gap-2">
            <p className="text-sm">{counterUrl}</p>

            <div className="flex justify-between gap-2">
              <ButtonCopyToClipboard text={'Copy to clipboard'} content={counterUrl} />

              <a target="_blank" rel="noopener noreferrer" href={`${counterUrl}&test=1`}>
                <Button>{'Test link'}</Button>
              </a>
            </div>
          </div>
        )}

        <Link href={'/'}>
          <Button>{`Back`}</Button>
        </Link>
      </main>
    </div>
  );
}
