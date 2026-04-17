"use client";

import { Code2, ShieldCheck, Smartphone, Waypoints } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    title: "Software Development",
    description: "Modern and scalable systems engineered for reliability.",
    icon: Code2,
  },
  {
    title: "Technology Consulting",
    description: "Practical strategy to align technology with business growth.",
    icon: Waypoints,
  },
  {
    title: "Cybersecurity",
    description: "Security-first architecture, audits, and active hardening.",
    icon: ShieldCheck,
  },
  {
    title: "Web & Mobile Apps",
    description: "High-performance digital products with polished experiences.",
    icon: Smartphone,
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-20 md:px-10">
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="rounded-3xl border border-[var(--border)] bg-[var(--surface)]/90 p-8 md:p-12"
      >
        <p className="mb-4 inline-flex rounded-full border border-[var(--border)] bg-[var(--surface2)] px-4 py-1 text-sm text-[var(--muted)]">
          SlimCyberTech
        </p>
        <h1 className="text-4xl font-bold leading-tight text-[var(--white)] md:text-6xl">
          Building the Future
          <br />
          <span className="bg-[var(--gradient)] bg-clip-text text-transparent">
            With Code
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-[var(--muted)]">
          Software engineering solutions designed for ambitious organizations.
        </p>
      </motion.section>

      <section className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
        {services.map((service, index) => (
          <motion.article
            key={service.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 * index }}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/75 p-6"
          >
            <service.icon className="mb-4 h-6 w-6 text-[var(--cyan)]" />
            <h2 className="text-xl font-semibold text-[var(--white)]">
              {service.title}
            </h2>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
              {service.description}
            </p>
          </motion.article>
        ))}
      </section>
    </main>
  );
}
