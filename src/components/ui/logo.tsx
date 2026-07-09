import { cn } from '@/lib/utils';

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
} as const;

function Logo({ className, size = 'md', ...props }: LogoProps) {
  return (
    <div
      className={cn('font-bold tracking-tight', sizeClasses[size], className)}
      {...props}
    >
      <span className="text-foreground">Git</span>
      <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
        Verse
      </span>
    </div>
  );
}

export { Logo };
