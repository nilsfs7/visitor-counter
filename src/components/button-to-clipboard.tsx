'use client';

import { copyToClipboard } from '../lib/helper/copy-to-clipboard';
import { Button } from './ui/button';
import { Toaster, toast } from 'sonner';

interface IButtonCopyToClipboard {
  text: string;
  content: string;
}

export const ButtonCopyToClipboard = ({ text, content }: IButtonCopyToClipboard) => {
  const handleCopyClicked = (content: string) => {
    copyToClipboard(content);
    toast.success('Copied to clipboard');
  };

  return (
    <>
      <Toaster richColors />

      <Button
        onClick={() => {
          handleCopyClicked(content);
        }}
      >
        {text}
      </Button>
    </>
  );
};
