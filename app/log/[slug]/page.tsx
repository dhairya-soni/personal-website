import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { logs } from "@/lib/content";
import { StatusBadge } from "@/components/status-badge";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return logs.map((log) => ({ slug: log.slug }));
}

export default async function LogEntry({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const log = logs.find((l) => l.slug === slug);
  if (!log) notFound();

  return (
    <div className="max-w-3xl mx-auto px-6 pt-28 pb-16">
      <Link
        href="/log"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-text-muted hover:text-accent-green transition-colors mb-8"
      >
        <ArrowLeft size={12} /> back to log
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <StatusBadge status={log.status} />
          <span className="font-mono text-xs text-text-muted">{log.project}</span>
          <span className="text-text-muted">·</span>
          <span className="font-mono text-xs text-text-muted">{formatDate(log.date)}</span>
        </div>
        <h1 className="font-mono text-2xl font-bold text-text-primary mb-4">{log.title}</h1>
        <p className="text-text-secondary leading-relaxed">{log.summary}</p>
        <div className="flex flex-wrap gap-1.5 mt-4">
          {log.tags.map((tag) => (
            <span key={tag} className="font-mono text-xs text-text-muted bg-white/5 border border-white/5 px-2 py-0.5 rounded">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t border-white/5 pt-8">
        <div className="prose prose-invert prose-sm max-w-none
          prose-headings:font-mono prose-headings:text-text-primary prose-headings:font-semibold
          prose-p:text-text-secondary prose-p:leading-relaxed
          prose-code:text-accent-green prose-code:bg-bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-bg-secondary prose-pre:border prose-pre:border-white/5 prose-pre:rounded-lg
          prose-table:text-sm prose-th:text-text-muted prose-th:font-mono prose-th:text-xs prose-td:text-text-secondary
          prose-strong:text-text-primary
          prose-a:text-accent-green prose-a:no-underline hover:prose-a:underline
          prose-li:text-text-secondary
          prose-hr:border-white/5
        ">
          {log.status === "planned" ? (
            <div className="bg-bg-secondary border border-white/5 rounded-lg p-6 text-center">
              <p className="font-mono text-xs text-text-muted mb-1">coming soon</p>
              <p className="text-text-secondary text-sm">This attempt hasn&apos;t started yet. Check back soon.</p>
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: simpleMarkdown(log.content) }} />
          )}
        </div>
      </div>
    </div>
  );
}

function simpleMarkdown(md: string): string {
  return md
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/^\| (.+) \|$/gm, (_, row) => {
      const cells = row.split(' | ').map((c: string) => `<td>${c}</td>`).join('');
      return `<tr>${cells}</tr>`;
    })
    .replace(/^---$/gm, '<hr/>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hupct]|<li|<tr)(.+)$/gm, '<p>$1</p>');
}
