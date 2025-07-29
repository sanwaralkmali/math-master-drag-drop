import React from "react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

interface LatexProps {
  children: string;
  display?: boolean;
  className?: string;
}

export const Latex: React.FC<LatexProps> = ({
  children,
  display = false,
  className = "",
}) => {
  // Check if content contains LaTeX syntax (starts and ends with $)
  const isLatex =
    children.trim().startsWith("$") && children.trim().endsWith("$");

  if (isLatex) {
    // Extract the LaTeX content (remove the $ symbols)
    const latexContent = children.trim().slice(1, -1);

    try {
      if (display) {
        return <BlockMath math={latexContent} className={className} />;
      } else {
        return <InlineMath math={latexContent} className={className} />;
      }
    } catch (error) {
      // Fallback to plain text if LaTeX parsing fails
      console.warn("LaTeX parsing error:", error);
      console.warn("Failed content:", latexContent);
      return <span className={className}>{children}</span>;
    }
  } else {
    // If not LaTeX, return as plain text
    return <span className={className}>{children}</span>;
  }
};

// Helper component for inline math
export const InlineLatex: React.FC<{
  children: string;
  className?: string;
}> = ({ children, className }) => (
  <Latex display={false} className={className}>
    {children}
  </Latex>
);

// Helper component for block math
export const BlockLatex: React.FC<{ children: string; className?: string }> = ({
  children,
  className,
}) => (
  <Latex display={true} className={className}>
    {children}
  </Latex>
);
