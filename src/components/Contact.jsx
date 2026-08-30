import { motion } from "framer-motion";
import Section from "./Section";
import { contactContent, socials } from "../data/content";
import { EnvelopeIcon, MapPinIcon, SocialIcon, ArrowUpRightIcon } from "./Icons";

export default function Contact() {
  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title={contactContent.heading}
      subtitle={contactContent.description}
    >
      <div className="mx-auto max-w-4xl space-y-10 text-center">
        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          {contactContent.availability}
        </div>

        {/* Big Heading Prompt */}
        <div className="space-y-4">
          <h3 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Let's build something great together.
          </h3>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-[#B3B3B3]">
            I'm always open to discussing new projects, internship opportunities, or collaborative software development. Feel free to drop an email or connect on social media.
          </p>
        </div>

        {/* Direct Contact Cards */}
        <div className="grid gap-4 sm:grid-cols-2 text-left">
          {/* Email Card */}
          <a
            href={`mailto:${contactContent.email}`}
            className="group glass-card flex items-center justify-between rounded-2xl p-6 border border-white/[0.06] bg-[#0A0A0E] transition-all duration-300 hover:-translate-y-1 hover:border-[#3B82F6]/40 hover:shadow-[0_10px_30px_rgba(59,130,246,0.10)]"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#3B82F6]/10 text-[#3B82F6] transition-transform duration-300 group-hover:scale-110">
                <EnvelopeIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#7A7A7A]">Email</p>
                <p className="text-base font-semibold text-white transition-colors duration-300 group-hover:text-[#60A5FA]">
                  {contactContent.email}
                </p>
              </div>
            </div>
            <ArrowUpRightIcon className="h-5 w-5 text-[#7A7A7A] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#60A5FA]" />
          </a>

          {/* Location Card */}
          <div className="glass-card flex items-center gap-4 rounded-2xl p-6 border border-white/[0.06] bg-[#0A0A0E]">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#3B82F6]/10 text-[#3B82F6]">
              <MapPinIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#7A7A7A]">Location</p>
              <p className="text-base font-semibold text-white">{contactContent.location}</p>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="pt-4">
          <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-[#7A7A7A]">
            Connect on Socials
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {socials.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -4, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-[#0A0A0E] px-5 py-3 text-sm font-semibold text-[#B3B3B3] transition-all duration-300 hover:border-[#3B82F6]/40 hover:text-white hover:shadow-[0_8px_20px_rgba(59,130,246,0.10)]"
                aria-label={social.label}
              >
                <SocialIcon type={social.icon} className="h-5 w-5 text-[#3B82F6]" />
                <span>{social.label}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
