import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        allowedElements={[
          "p", "br", "strong", "em", "del",
          "h1", "h2", "h3", "h4", "h5", "h6",
          "ul", "ol", "li",
          "a", "img",
          "blockquote",
          "code", "pre",
          "hr",
          "table", "thead", "tbody", "tr", "th", "td",
          "input",
        ]}
        urlTransform={(url) => url}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
