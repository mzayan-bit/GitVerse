import { cn } from '@/lib/utils';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
}

function Section({
  className,
  as: Component = 'section',
  children,
  ...props
}: SectionProps) {
  return (
    <Component className={cn('py-16 md:py-24', className)} {...props}>
      {children}
    </Component>
  );
}

export { Section };
