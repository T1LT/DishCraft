import Markdown from "markdown-to-jsx";
import Link from "next/link";

interface MarkdownRendererProps {
  options?: object;
  children: string;
  [key: string]: any;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  options,
  children,
  ...rest
}) => {
  return (
    <Markdown
      options={{
        ...options,
        overrides: {
          a: ({ className, ...rest }) => (
            <Link className="hover:underline underline-offset-4" {...rest} />
          ),
          p: ({ children }) => <p className="my-2">{children}</p>,
          img: () => null,
          ul: ({ children }) => (
            <ul className="list-disc flex flex-col gap-2 list-inside">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal flex flex-col gap-2 list-inside">
              {children}
            </ol>
          ),
          h1: ({ children }) => (
            <h1 className="font-bold text-lg">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-bold text-base">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-bold text-sm">{children}</h3>
          ),
        },
      }}
      {...rest}
    >
      {children}
    </Markdown>
  );
};
