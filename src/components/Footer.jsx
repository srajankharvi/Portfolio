import { navItems, socials, footerContent } from "../data/content";
import { ChevronUpIcon, SocialIcon } from "./Icons";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-white/[0.06] bg-black/80 py-16">
      <div className="mx-auto w-[min(100%-2rem,1200px)]">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
          {/* Brand & Tagline */}
          <div className="space-y-4">
            <h3 className="font-heading text-3xl font-bold tracking-tight text-primary">
              {footerContent.name}
            </h3>
            <p className="max-w-md text-sm leading-relaxed text-secondary">
              {footerContent.description}
            </p>
          </div>

          {/* Nav links & Back to Top */}
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-12">
            <div className="flex flex-wrap gap-6">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="animated-underline text-sm font-medium text-secondary transition-colors hover:text-primary"
                >
                  {item}
                </a>
              ))}
            </div>

            <button
              onClick={scrollToTop}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.04] text-secondary transition-colors hover:border-white/[0.1] hover:text-primary"
              aria-label="Back to top"
            >
              <ChevronUpIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-white/[0.06] pt-8 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} {footerContent.name}. All rights reserved.</p>

          <div className="flex items-center gap-4">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted transition-colors hover:text-primary"
                aria-label={social.label}
              >
                <SocialIcon type={social.icon} className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
