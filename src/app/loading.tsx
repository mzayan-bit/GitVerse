import { Container } from '@/components/ui/container';

export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Container className="py-24">
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <div className="size-8 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
        </div>
      </Container>
    </div>
  );
}
