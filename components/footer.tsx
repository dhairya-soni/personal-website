import Link from "next/link";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { SiHashnode, SiDevdotto } from "react-icons/si";

export function Footer() {
  return (
    <footer className="border-t border-white/5 mt-24">
      <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-mono text-xs text-text-muted">
          dhairya soni · vit vellore · {new Date().getFullYear()}
        </p>
        <div className="flex items-center gap-5">
          <Link href="https://github.com/dhairya-soni" target="_blank" className="text-white/50 hover:text-white transition-colors" title="GitHub">
            <FaGithub size={17} />
          </Link>
          <Link href="https://www.linkedin.com/in/dhairya-soni-a3b215262/" target="_blank" className="text-white/50 hover:text-[#0A66C2] transition-colors" title="LinkedIn">
            <FaLinkedinIn size={17} />
          </Link>
          <Link href="https://hashnode.com/" target="_blank" className="text-white/50 hover:text-[#2962FF] transition-colors" title="Hashnode">
            <SiHashnode size={17} />
          </Link>
          <Link href="https://dev.to/" target="_blank" className="text-white/50 hover:text-white transition-colors" title="Dev.to">
            <SiDevdotto size={17} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
