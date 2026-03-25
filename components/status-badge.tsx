type Status = "active" | "completed" | "planned" | "paused" | "writing";

const config: Record<Status, { label: string; color: string; dot: string }> = {
  active: { label: "active", color: "text-accent-green border-accent-green/30 bg-accent-green/10", dot: "bg-accent-green animate-pulse-slow" },
  completed: { label: "completed", color: "text-accent-blue border-accent-blue/30 bg-accent-blue/10", dot: "bg-accent-blue" },
  planned: { label: "planned", color: "text-text-secondary border-white/10 bg-white/5", dot: "bg-text-secondary" },
  paused: { label: "paused", color: "text-accent-amber border-accent-amber/30 bg-accent-amber/10", dot: "bg-accent-amber" },
  writing: { label: "writing", color: "text-purple-400 border-purple-400/30 bg-purple-400/10", dot: "bg-purple-400 animate-pulse-slow" },
};

export function StatusBadge({ status }: { status: Status }) {
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border font-mono text-xs ${c.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
