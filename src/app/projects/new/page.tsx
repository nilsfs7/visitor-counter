'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ButtonCopyToClipboard } from '../../../components/button-to-clipboard';
import { createProject } from '../../../infra/clients/project.client';

type FieldErrors = {
  name?: string;
  destination?: string;
};

function validateFields(name: string, destination: string): FieldErrors {
  const errors: FieldErrors = {};

  if (!name.trim()) {
    errors.name = 'Project name is required.';
  }

  if (!destination.trim()) {
    errors.destination = 'Target URL is required.';
  } else {
    try {
      const url = new URL(destination.trim());
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        errors.destination = 'Target URL must start with http:// or https://.';
      }
    } catch {
      errors.destination = 'Target URL must be a valid URL.';
    }
  }

  return errors;
}

export default function NewProject() {
  const [counterUrl, setCounterUrl] = useState<string>();
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateProjectClicked = async () => {
    const errors = validateFields(name, destination);
    setFieldErrors(errors);
    setFormError(undefined);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const url = new URL(destination.trim());
      const createdCounterUrl = await createProject(name.trim(), description.trim(), url.toString());
      setCounterUrl(createdCounterUrl);
      setFieldErrors({});
      setFormError(undefined);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create project.';
      setFormError(message);
      console.error(`Failed to create project.`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <div className="flex flex-col gap-2 w-full max-w-md">
          <div className="flex flex-col gap-1">
            <Label htmlFor="input-name">{`Project name`}</Label>
            <Input
              id="input-name"
              className="h-full w-full rounded-lg border border-secondary-dark p-1"
              placeholder="GFFC 25"
              value={name}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? 'error-name' : undefined}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setName(event.currentTarget.value);
                if (fieldErrors.name) {
                  setFieldErrors(current => ({ ...current, name: undefined }));
                }
              }}
            />
            {fieldErrors.name && (
              <p id="error-name" className="text-sm text-destructive" role="alert">
                {fieldErrors.name}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="input-description">{`Description`}</Label>
            <Input
              id="input-description"
              className="h-full w-full rounded-lg border border-secondary-dark p-1"
              placeholder="Track handouts"
              value={description}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setDescription(event.currentTarget.value);
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="input-destination">{`Target URL`}</Label>
            <Input
              id="input-destination"
              className="h-full w-full rounded-lg border border-secondary-dark p-1"
              placeholder="https://fsmeet.com/..."
              value={destination}
              aria-invalid={Boolean(fieldErrors.destination)}
              aria-describedby={fieldErrors.destination ? 'error-destination' : undefined}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setDestination(event.currentTarget.value);
                if (fieldErrors.destination) {
                  setFieldErrors(current => ({ ...current, destination: undefined }));
                }
              }}
            />
            {fieldErrors.destination && (
              <p id="error-destination" className="text-sm text-destructive" role="alert">
                {fieldErrors.destination}
              </p>
            )}
          </div>

          {formError && (
            <p className="text-sm text-destructive" role="alert">
              {formError}
            </p>
          )}

          <Button disabled={isSubmitting} onClick={handleCreateProjectClicked}>
            {isSubmitting ? 'Creating…' : 'Create project'}
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
