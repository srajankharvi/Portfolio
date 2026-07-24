import { useState } from "react";
import { motion } from "framer-motion";
import Section from "./Section";
import { contactContent, socials } from "../data/content";
import { EnvelopeIcon, MapPinIcon, SendIcon, SocialIcon } from "./Icons";

export default function Contact() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Construct mailto link
    const mailto = `mailto:${contactContent.email}?subject=${encodeURIComponent(
      `Portfolio Inquiry from ${formState.name}`
    )}&body=${encodeURIComponent(
      `Name: ${formState.name}\nEmail: ${formState.email}\n\nMessage:\n${formState.message}`
    )}`;

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      window.location.href = mailto;
    }, 600);
  };

  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title={contactContent.heading}
      subtitle={contactContent.description}
    >
      <div className="grid gap-12 lg:grid-cols-12">
        {/* Left Column — Info & Socials */}
        <div className="space-y-8 lg:col-span-5">
          {/* Availability Badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-medium text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {contactContent.availability}
          </div>

          <div className="space-y-4">
            <h3 className="font-heading text-2xl font-bold text-primary">
              Reach Out Directly
            </h3>
            <p className="text-secondary leading-relaxed">
              I'm always open to discussing new projects, internship opportunities, or collaborative software development.
            </p>
          </div>

          {/* Quick Info Cards */}
          <div className="space-y-4">
            <a
              href={`mailto:${contactContent.email}`}
              className="glass-card flex items-center gap-4 rounded-2xl p-4 transition-colors hover:border-border-hover"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-dim text-accent">
                <EnvelopeIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted">Email</p>
                <p className="text-sm font-medium text-primary">{contactContent.email}</p>
              </div>
            </a>

            <div className="glass-card flex items-center gap-4 rounded-2xl p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-dim text-accent">
                <MapPinIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted">Location</p>
                <p className="text-sm font-medium text-primary">{contactContent.location}</p>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">
              Connect on Socials
            </p>
            <div className="flex flex-wrap gap-3">
              {socials.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -4, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-secondary transition-colors hover:border-border-hover hover:text-primary"
                  aria-label={social.label}
                >
                  <SocialIcon type={social.icon} className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column — Modern Glass Contact Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="glass-card space-y-6 rounded-3xl p-8 lg:p-10"
          >
            <div>
              <label htmlFor="name" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-secondary">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                required
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                placeholder="John Doe"
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-primary placeholder-muted focus-ring transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-secondary">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                required
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                placeholder="john@example.com"
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-primary placeholder-muted focus-ring transition-colors"
              />
            </div>

            <div>
              <label htmlFor="message" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-secondary">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                placeholder="Hello Srajan, I'd like to connect regarding..."
                className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-primary placeholder-muted focus-ring transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full"
            >
              {isSubmitting ? (
                <span>Sending...</span>
              ) : submitted ? (
                <span>Message Sent!</span>
              ) : (
                <>
                  <span>Send Message</span>
                  <SendIcon className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </Section>
  );
}
