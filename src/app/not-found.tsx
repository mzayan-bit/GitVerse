import Link from 'next/link';

import { Container } from '@/components/ui/container';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Container className="py-24">
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <p className="text-7xl font-bold text-muted-foreground/30">404</p>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">
            Page not found
          </h1>
          <p className="mt-2 text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
          <Link
            href="/"
            className={cn(buttonVariants({ variant: 'outline' }), 'mt-8 gap-2')}
          >
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>
        </div>
      </Container>
    </div>
  );
}
