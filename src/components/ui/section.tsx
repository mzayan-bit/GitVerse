import { createElement } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

function Section({
  className,
  as: component = 'section',
  children,
  ...props
}: SectionProps) {
  return createElement(
    component,
    {
      className: cn('py-16 md:py-24', className),
      ...props,
    },
    children
  );
}

export { Section };
