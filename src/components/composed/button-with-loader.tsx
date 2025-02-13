import React from 'react';

import { Loader2Icon } from 'lucide-react';

import { Button, ButtonProps } from '@/components/ui/button';

type TButtonWithLoaderProps = ButtonProps & {
  initialIcon?: React.ReactElement;
  initialText?: string;
  isLoading: boolean;
  loadingText: string;
};

export const ButtonWithLoader = React.forwardRef<
  HTMLButtonElement,
  TButtonWithLoaderProps
>(({ ...props }, ref) => {
  const {
    isLoading,
    initialIcon,
    initialText,
    loadingText,
    disabled,
    ...rest
  } = props;

  return (
    <Button ref={ref} {...rest} disabled={isLoading || disabled}>
      {!isLoading && initialIcon ? initialIcon : null}
      {isLoading ? <Loader2Icon className="animate-spin" /> : null}
      {isLoading && loadingText ? loadingText : initialText}
    </Button>
  );
});
