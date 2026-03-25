"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { SiHashnode, SiDevdotto } from "react-icons/si";
import { IconType } from "react-icons";

const socials: {
  icon: IconType;
  label: string;
  handle: string;
  href: string;
  description: string;
  hoverColor: string;
}[] = [
  {
    icon: FaGithub,
    label: "GitHub",
    handle: "dhairya-soni",
    href: "https://github.com/dhairya-soni",
    description: "All my code, commits, and projects",
    hoverColor: "group-hover:text-white",
  },
  {
    icon: FaLinkedinIn,
    label: "LinkedIn",
    handle: "Dhairya Soni",
    href: "https://www.linkedin.com/in/dhairya-soni-a3b215262/",
    description: "Best place to reach me — DMs open",
    hoverColor: "group-hover:text-[#0A66C2]",
  },
  {
    icon: SiHashnode,
    label: "Hashnode",
    handle: "coming soon",
    href: "#",
    description: "Long-form technical articles",
    hoverColor: "group-hover:text-[#2962FF]",
  },
  {
    icon: SiDevdotto,
    label: "Dev.to",
    handle: "coming soon",
    href: "#",
    description: "Cross-posted articles",
    hoverColor: "group-hover:text-white",
  },
];

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-28 pb-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <h1 className="font-mono text-2xl font-bold text-text-primary mb-3">contact</h1>
        <p className="text-text-secondary text-sm leading-relaxed max-w-lg">
          Best way to reach me is LinkedIn DM. If you&apos;re on a similar learning journey, always happy to talk.
        </p>
      </motion.div>

      <div className="space-y-3">
        {socials.map((social, i) => {
          const isDisabled = social.href === "#";
          return (
            <motion.div
              key={social.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              {isDisabled ? (
                <div className="flex items-center gap-4 p-4 bg-bg-card border border-white/5 rounded-lg opacity-50">
                  <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    <social.icon size={17} className="text-white/40" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-text-muted">{social.label}</span>
                      <span className="text-sm font-medium truncate text-text-muted italic">{social.handle}</span>
                    </div>
                    <p className="text-text-muted text-xs">{social.description}</p>
                  </div>
                </div>
              ) : (
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-bg-card border border-white/5 rounded-lg hover:border-white/10 transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors flex-shrink-0">
                    <social.icon size={17} className={`text-white/40 transition-colors ${social.hoverColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-text-muted">{social.label}</span>
                      <span className="text-text-primary text-sm font-medium truncate">{social.handle}</span>
                    </div>
                    <p className="text-text-muted text-xs">{social.description}</p>
                  </div>
                  <ExternalLink size={13} className="text-text-muted group-hover:text-white/60 transition-colors flex-shrink-0" />
                </a>
              )}
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-10 p-4 bg-bg-secondary border border-white/5 rounded-lg"
      >
        <p className="font-mono text-xs text-text-muted mb-1">preferred contact</p>
        <p className="text-text-secondary text-sm">
          LinkedIn DMs — I reply within 24 hours. Once Hashnode and Dev.to are up, article comments work too.
        </p>
      </motion.div>
    </div>
  );
}
