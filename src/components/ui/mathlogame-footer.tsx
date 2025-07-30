import React from 'react';

export function MATHLOGAMEFooter() {
  return (
    <footer className="w-full py-4 text-center text-sm text-muted-foreground border-t bg-background/80 backdrop-blur-sm font-cairo flex-shrink-0">
      <a
        href="https://sanwaralkmali.github.io/mathlogame"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 hover:opacity-80 transition-opacity"
      >
        <img src="/MATHLOGAME-light.png" alt="MATHLOGAME" className="h-12 w-auto" />
        Powered by
        <span className="mathlogame-logo"> MATHLOGAME</span>
      </a>
    </footer>
  );
} 