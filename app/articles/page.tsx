"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { articles } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export default function ArticlesPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-28 pb-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <h1 className="font-mono text-2xl font-bold text-text-primary mb-3">articles</h1>
        <p className="text-text-secondary text-sm leading-relaxed max-w-lg">
          Written after I&apos;ve understood something well enough to explain it. Published on Hashnode and Dev.to.
        </p>
      </motion.div>

      <div className="space-y-4">
        {articles.map((article, i) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-bg-card border border-white/5 rounded-lg p-5 hover:border-accent-green/20 transition-all"
          >
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <StatusBadge status={article.status} />
              <span className="font-mono text-xs text-text-muted">{formatDate(article.date)}</span>
            </div>
            <h2 className="text-text-primary font-semibold mb-2">{article.title}</h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-3">{article.summary}</p>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex flex-wrap gap-1.5">
                {article.tags.map((tag) => (
                  <span key={tag} className="font-mono text-xs text-text-muted bg-white/5 px-1.5 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
              {article.externalLink && (
                <a
                  href={article.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-xs text-accent-green hover:underline"
                >
                  read <ExternalLink size={11} />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-10 p-4 border border-accent-amber/20 bg-accent-amber/5 rounded-lg"
      >
        <p className="font-mono text-xs text-accent-amber mb-1">publishing plan</p>
        <p className="text-text-secondary text-sm">
          First article drops after the URL shortener rebuild is complete. Writing while building, not after.
        </p>
      </motion.div>
    </div>
  );
}
