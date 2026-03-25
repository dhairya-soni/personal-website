"use client";

import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import { StatusBadge } from "@/components/status-badge";
import { TerminalLine } from "@/components/terminal-line";
import { logs, projects, articles } from "@/lib/content";
import { formatDate } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  const latestLog = logs[0];
  const activeProject = projects.find((p) => p.status === "active");
  const latestArticle = articles[0];

  return (
    <div className="max-w-3xl mx-auto px-6 pt-28 pb-16">
      {/* Hero */}
      <motion.section
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        className="mb-20"
      >
        <motion.div variants={fadeUp} className="mb-3">
          <span className="font-mono text-xs text-accent-green bg-accent-green/10 border border-accent-green/20 px-2 py-1 rounded">
            cs student · vit vellore · 4th year
          </span>
        </motion.div>

        <motion.h1 variants={fadeUp} className="font-mono text-3xl sm:text-4xl font-bold text-text-primary mb-4 leading-tight">
          Dhairya Soni
        </motion.h1>

        <motion.p variants={fadeUp} className="text-text-secondary text-base leading-relaxed max-w-lg mb-6">
          I build things, break them under load, then figure out why. Documenting the journey from writing code that works to understanding why it works.
        </motion.p>

        {/* Terminal block */}
        <motion.div variants={fadeUp} className="bg-bg-secondary border border-white/5 rounded-lg p-4 font-mono text-sm mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-accent-red/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-accent-amber/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-accent-green/60" />
            <span className="text-text-muted text-xs ml-2">terminal</span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="text-text-muted">$ status --current</div>
            <div className="text-accent-green">
              <TerminalLine text="→ building: URL Shortener (attempt 1 complete)" delay={300} />
            </div>
            <div className="text-accent-amber">
              <TerminalLine text="→ learning: PostgreSQL + Redis + Docker" delay={800} />
            </div>
            <div className="text-accent-blue">
              <TerminalLine text="→ writing: first article (in progress)" delay={1300} />
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
          <Link
            href="/log"
            className="inline-flex items-center gap-2 bg-accent-green text-bg-primary font-mono text-xs font-semibold px-4 py-2 rounded hover:bg-accent-green-dim transition-colors"
          >
            <Terminal size={13} />
            read the build log
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 border border-white/10 text-text-secondary font-mono text-xs px-4 py-2 rounded hover:border-white/20 hover:text-text-primary transition-colors"
          >
            view projects <ArrowRight size={13} />
          </Link>
        </motion.div>
      </motion.section>

      {/* Currently Building */}
      {activeProject && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="font-mono text-xs text-text-muted uppercase tracking-widest mb-4">
            currently building
          </h2>
          <div className="bg-bg-card border border-white/5 rounded-lg p-5 hover:border-accent-green/20 transition-colors">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <StatusBadge status={activeProject.status} />
                </div>
                <h3 className="text-text-primary font-semibold">{activeProject.name}</h3>
              </div>
              <Link href="/log" className="text-text-muted hover:text-accent-green transition-colors">
                <ArrowRight size={16} />
              </Link>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">{activeProject.description}</p>
            <div className="border-t border-white/5 pt-3">
              <p className="font-mono text-xs text-text-muted mb-2">learning through this:</p>
              <div className="flex flex-wrap gap-2">
                {activeProject.what_im_learning.map((item) => (
                  <span key={item} className="font-mono text-xs text-text-secondary bg-white/5 px-2 py-0.5 rounded">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Latest Log Entry */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-16"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-mono text-xs text-text-muted uppercase tracking-widest">latest log entry</h2>
          <Link href="/log" className="font-mono text-xs text-text-muted hover:text-accent-green transition-colors flex items-center gap-1">
            all entries <ArrowRight size={12} />
          </Link>
        </div>

        <Link href={`/log/${latestLog.slug}`}>
          <div className="bg-bg-card border border-white/5 rounded-lg p-5 hover:border-accent-green/20 transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <StatusBadge status={latestLog.status} />
              <span className="font-mono text-xs text-text-muted">{latestLog.project}</span>
              <span className="text-text-muted">·</span>
              <span className="font-mono text-xs text-text-muted">{formatDate(latestLog.date)}</span>
            </div>
            <h3 className="text-text-primary font-semibold mb-2 group-hover:text-accent-green transition-colors">
              {latestLog.title}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed">{latestLog.summary}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {latestLog.tags.map((tag) => (
                <span key={tag} className="font-mono text-xs text-text-muted bg-white/5 px-1.5 py-0.5 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </Link>
      </motion.section>

      {/* Latest Article */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-16"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-mono text-xs text-text-muted uppercase tracking-widest">latest article</h2>
          <Link href="/articles" className="font-mono text-xs text-text-muted hover:text-accent-green transition-colors flex items-center gap-1">
            all articles <ArrowRight size={12} />
          </Link>
        </div>

        <div className="bg-bg-card border border-white/5 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <StatusBadge status={latestArticle.status} />
            <span className="font-mono text-xs text-text-muted">{formatDate(latestArticle.date)}</span>
          </div>
          <h3 className="text-text-primary font-semibold mb-2">{latestArticle.title}</h3>
          <p className="text-text-secondary text-sm leading-relaxed">{latestArticle.summary}</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {latestArticle.tags.map((tag) => (
              <span key={tag} className="font-mono text-xs text-text-muted bg-white/5 px-1.5 py-0.5 rounded">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Learning Roadmap preview */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h2 className="font-mono text-xs text-text-muted uppercase tracking-widest mb-4">12-week roadmap</h2>
        <div className="space-y-2">
          {[
            { phase: "01", label: "URL Shortener → PostgreSQL + Redis + Docker", status: "active" as const, week: "Weeks 1–4" },
            { phase: "02", label: "Real-time Chat → WebSockets + horizontal scaling", status: "planned" as const, week: "Weeks 5–8" },
            { phase: "03", label: "Job Queue → async processing + monitoring", status: "planned" as const, week: "Weeks 9–12" },
          ].map((item) => (
            <div key={item.phase} className="flex items-center gap-4 py-2 border-b border-white/5">
              <span className="font-mono text-xs text-text-muted w-6">{item.phase}</span>
              <span className={`text-sm flex-1 ${item.status === "active" ? "text-text-primary" : "text-text-secondary"}`}>
                {item.label}
              </span>
              <StatusBadge status={item.status} />
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
