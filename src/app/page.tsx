import { Container } from '@/components/ui/container';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import the 3D canvas with SSR disabled
const GitVerseCanvas = dynamic(() => import('@/components/canvas-wrapper'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 z-0 flex items-center justify-center bg-black">
      <Loader2 className="size-8 animate-spin text-indigo-500" />
    </div>
  ),
});

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative flex flex-1 items-center justify-center overflow-hidden bg-black">
        {/* 3D Universe Canvas Background */}
        <GitVerseCanvas />

        <Container className="relative z-10 py-24 md:py-32">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
              <Sparkles className="size-3.5" />
              <span>Open Source Universe Explorer</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="text-foreground">Explore repos as</span>
              <br />
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                planets in a universe
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              GitVerse transforms GitHub repositories into interactive planets.
              Visualize code, contributors, and activity like never before.
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <Button size="lg" className="gap-2 px-6">
                Get Started
                <ArrowRight className="size-4" />
              </Button>
              <a
                href="https://github.com/mzayan-bit/GitVerse"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'px-6'
                )}
              >
                View on GitHub
              </a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
