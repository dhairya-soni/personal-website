"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { work } from "@/lib/content";

const categoryLabel: Record<string, { label: string; color: string }> = {
  fullstack: { label: "full-stack", color: "text-accent-green border-accent-green/30 bg-accent-green/10" },
  ml: { label: "ml / ai", color: "text-purple-400 border-purple-400/30 bg-purple-400/10" },
  research: { label: "research", color: "text-accent-blue border-accent-blue/30 bg-accent-blue/10" },
};

export default function WorkPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-28 pb-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
        <h1 className="font-mono text-2xl font-bold text-text-primary mb-3">work</h1>
        <p className="text-text-secondary text-sm leading-relaxed max-w-lg">
          Projects I&apos;ve shipped. Some were built with AI assistance — I&apos;m going back through them to understand what&apos;s actually happening under the hood.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mb-10 p-3 border border-accent-amber/20 bg-accent-amber/5 rounded-lg flex items-start gap-2"
      >
        <span className="text-accent-amber text-xs mt-0.5">→</span>
        <p className="text-text-secondary text-xs leading-relaxed">
          Want to see how these actually work at scale?{" "}
          <a href="/log" className="text-accent-green hover:underline">Follow the build log</a>{" "}
          where I rebuild them from first principles.
        </p>
      </motion.div>

      <div className="space-y-5">
        {work.map((project, i) => {
          const cat = categoryLabel[project.category];
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-bg-card border border-white/5 rounded-lg p-6 hover:border-white/10 transition-all group"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-mono text-xs px-2 py-0.5 rounded border ${cat.color}`}>
                    {cat.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/40 hover:text-white transition-colors"
                      title="GitHub"
                    >
                      <FaGithub size={15} />
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-xs text-accent-green border border-accent-green/30 bg-accent-green/10 px-2 py-0.5 rounded hover:bg-accent-green/20 transition-colors"
                    >
                      live <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </div>

              <h2 className="text-text-primary font-semibold mb-2 leading-snug">{project.name}</h2>
              <p className="text-text-secondary text-sm leading-relaxed mb-4">{project.description}</p>

              {/* Tech tags */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {project.tech.map((t) => (
                  <span key={t} className="font-mono text-xs text-text-secondary bg-white/5 border border-white/5 px-2 py-0.5 rounded">
                    {t}
                  </span>
                ))}
              </div>

              {/* Note */}
              {project.note && (
                <div className="border-t border-white/5 pt-3 flex items-start gap-2">
                  <span className="text-accent-amber text-xs mt-0.5 flex-shrink-0">↳</span>
                  <p className="text-text-muted text-xs leading-relaxed">{project.note}</p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* More coming */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-4 border border-white/5 rounded-lg text-center"
      >
        <p className="font-mono text-xs text-text-muted mb-1">more coming</p>
        <p className="text-text-secondary text-sm">
          Adding GitHub links and live demos as I set them up.
        </p>
      </motion.div>
    </div>
  );
}
