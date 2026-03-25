"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { projects } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export default function ProjectsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-28 pb-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <h1 className="font-mono text-2xl font-bold text-text-primary mb-3">projects</h1>
        <p className="text-text-secondary text-sm leading-relaxed max-w-lg">
          Not &quot;portfolio&quot; projects — rebuilds. Each one is a system I&apos;m learning to understand from the inside out.
        </p>
      </motion.div>

      <div className="space-y-6">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-bg-card border border-white/5 rounded-lg p-6 hover:border-accent-green/20 transition-all"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <StatusBadge status={project.status} />
                <div className="flex items-center gap-1.5 text-text-muted">
                  <Calendar size={11} />
                  <span className="font-mono text-xs">{formatDate(project.startDate)}</span>
                </div>
              </div>
              {project.logs > 0 && (
                <Link href="/log" className="font-mono text-xs text-accent-green hover:underline flex items-center gap-1">
                  {project.logs} log {project.logs === 1 ? "entry" : "entries"} <ArrowRight size={11} />
                </Link>
              )}
            </div>

            <h2 className="text-text-primary font-semibold text-lg mb-2">{project.name}</h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">{project.description}</p>

            <div className="border-t border-white/5 pt-4 mb-4">
              <p className="font-mono text-xs text-text-muted mb-2">learning through this:</p>
              <ul className="space-y-1">
                {project.what_im_learning.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span className="text-accent-green mt-0.5">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {project.tech.map((t) => (
                <span key={t} className="font-mono text-xs text-text-secondary bg-white/5 border border-white/5 px-2 py-0.5 rounded">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
