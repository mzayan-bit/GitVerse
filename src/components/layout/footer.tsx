import { Container } from '@/components/ui/container';

function Footer() {
  return (
    <footer className="border-t border-border/40 py-8">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} GitVerse. Open source under MIT.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/mzayan-bit/GitVerse"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              GitHub
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Docs
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export { Footer };
