"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { logs } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export default function LogPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-28 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="font-mono text-2xl font-bold text-text-primary mb-3">build log</h1>
        <p className="text-text-secondary text-sm leading-relaxed max-w-lg">
          Chronological entries of every attempt — what I built, what broke, and what I learned. No polishing, no hindsight bias.
        </p>
      </motion.div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-0 top-2 bottom-2 w-px bg-white/5" />

        <div className="space-y-8 pl-6">
          {logs.map((log, i) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              {/* Timeline dot */}
              <div className={`absolute -left-[25px] top-2 w-2 h-2 rounded-full border ${
                log.status === "active" ? "bg-accent-green border-accent-green" : "bg-bg-tertiary border-white/20"
              }`} />

              <Link href={`/log/${log.slug}`}>
                <div className="bg-bg-card border border-white/5 rounded-lg p-5 hover:border-accent-green/20 transition-all group">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <StatusBadge status={log.status} />
                    <span className="font-mono text-xs text-text-muted">{log.project}</span>
                    <span className="text-text-muted">·</span>
                    <span className="font-mono text-xs text-text-muted">{formatDate(log.date)}</span>
                  </div>
                  <h2 className="text-text-primary font-semibold mb-2 group-hover:text-accent-green transition-colors flex items-center gap-2">
                    {log.title}
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h2>
                  <p className="text-text-secondary text-sm leading-relaxed mb-3">{log.summary}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {log.tags.map((tag) => (
                      <span key={tag} className="font-mono text-xs text-text-muted bg-white/5 px-1.5 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
