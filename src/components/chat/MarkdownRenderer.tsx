"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { CodeBlock } from "./CodeBlock";
import "highlight.js/styles/github-dark.css";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Render code blocks via our custom CodeBlock
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className ?? "");
            const language = match ? match[1] : undefined;
            const code = String(children).replace(/\n$/, "");

            if (!inline && (match || code.includes("\n"))) {
              // Extract filename from meta string if present
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const meta = (node?.data as any)?.meta as string | undefined;
              const filename = meta?.match(/filename="([^"]+)"/)?.[1];
              return (
                <CodeBlock language={language} filename={filename} code={code} />
              );
            }

            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },

          // Open links in new tab
          a({ href, children, ...props }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
