import { createElement } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

function Container({
  className,
  as: component = 'div',
  children,
  ...props
}: ContainerProps) {
  return createElement(
    component,
    {
      className: cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className),
      ...props,
    },
    children
  );
}

export { Container };
