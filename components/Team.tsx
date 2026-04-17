"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, BriefcaseBusiness } from "lucide-react";

const team = [
  {
    name: "Lema Aaron",
    role: "CEO & Software Engineer",
    image: "/images/Lema.jpeg",
    alt: "Lema Aaron portrait",
    specialties: ["Leadership", "Software Engineering"],
  },
  {
    name: "Awongo Fahadi Rashid",
    role: "Senior Software Engineer",
    image: "/images/Awongo Fahadi Rashid.jpeg",
    alt: "Awongo Fahadi Rashid portrait",
    specialties: ["Backend Systems", "Web Applications"],
  },
  {
    name: "Akuma Dalil",
    role: "IT Operations & Support Specialist",
    image: "/images/Akuma Dalil.jpeg",
    alt: "Akuma Dalil portrait",
    specialties: ["Infrastructure Support", "Systems Administration"],
  },
  {
    name: "Hussen Yang Salim",
    role: "Graphic Designer",
    image: "/images/Hussen Yang Salim.jpeg",
    alt: "Hussen Yang Salim portrait",
    specialties: ["Brand Identity", "Visual Design"],
  },
];

export default function Team() {
  return (
    <section id="team" className="mx-auto mt-10 w-full max-w-6xl px-4 sm:px-6 md:px-10">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--cyan)]">Team</p>
        <h2 className="mt-3 text-3xl text-[var(--white)] sm:text-4xl">The People Behind The Build</h2>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
        {team.map((member, index) => (
          <motion.article
            key={member.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[#111] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--cyan)]/60 hover:shadow-[0_16px_38px_-26px_rgba(0,198,255,0.7)]"
          >
            <div className="relative h-64 sm:h-72">
              <Image
                src={member.image}
                alt={member.alt}
                fill
                loading="lazy"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
            </div>

            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
              <p className="font-heading text-xl text-[var(--white)]">{member.name}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{member.role}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {member.specialties.map((specialty) => (
                  <span
                    key={`${member.name}-${specialty}`}
                    className="rounded-full border border-[var(--cyan)]/45 bg-black/35 px-2.5 py-1 text-xs text-[var(--white)]/90 backdrop-blur-sm"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
              <div className="mt-3">
                <Link
                  href="#contact"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[var(--cyan)] transition-colors duration-300 hover:text-[var(--white)]"
                  aria-label={`Contact ${member.name}`}
                >
                  <BriefcaseBusiness className="h-4 w-4" />
                  Work With {member.name.split(" ")[0]}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
