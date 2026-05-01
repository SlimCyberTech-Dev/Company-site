"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, BriefcaseBusiness } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { fadeUp, staggerItem, VIEWPORT_ONCE } from "@/lib/motion";

const team = [
  {
    name: "Lema Aaron",
    role: "Software Engineer",
    image: "/images/Lema.jpeg",
    alt: "Lema Aaron portrait",
    specialties: ["Leadership", "Software Engineer"],
  },
  {
    name: "Sebabe Swaleh",
    role: "Senior Software Engineer",
    image: "/images/Sebabe.jpg",
    alt: "Sebabe Swaleh",
    specialties: ["Backend Systems", "Web Applications"],
  },
  {
    name: "Awongo Fahadi Rashid",
    role: "Senior Software Engineer",
    image: "/images/Awongo Fahadi Rashid.jpeg",
    alt: "Awongo Fahadi Rashid portrait",
    specialties: ["Backend Systems", "Web Applications"],
  },
  {
    name: "Uhuru Diana",
    role: "Senior Front-end Developer",
    image: "/images/Diana.jpg",
    alt: "Uhuru Diana portrait",
    specialties: ["Front-end Developer", "Web Applications"],
  },
  {
    name: "Aguta Kennedy",
    role: "Web Developer, Graphic Designer",
    image: "/images/Keno.jpeg",
    alt: "Aguta Kennedy ",
    specialties: ["Web Developer", "Graphics Designer"],
  },
  {
    name: "Akuma Dalil",
    role: "IT Operations & Support Specialist",
    image: "/images/Akuma Dalil.jpg",
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
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const marqueeTeam = [...team, ...team];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let rafId = 0;

    const step = () => {
      if (!track || isPaused) {
        rafId = requestAnimationFrame(step);
        return;
      }

      // Native scroll-based marquee that still allows manual swipe/scroll.
      track.scrollLeft += 0.35;
      const loopPoint = track.scrollWidth / 2;
      if (loopPoint > 0 && track.scrollLeft >= loopPoint) {
        track.scrollLeft -= loopPoint;
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [isPaused]);

  const renderMemberCard = (member: (typeof team)[number], index: number, key: string) => (
    <motion.article
      key={key}
      variants={staggerItem}
      custom={index}
      whileHover={{ rotateX: 1.8, rotateY: -1.8 }}
      style={{ transformStyle: "preserve-3d" }}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--cyan)]/60 hover:shadow-[0_16px_38px_-26px_rgba(0,198,255,0.7)]"
    >
      <div className="relative h-60 sm:h-72">
        <Image
          src={member.image}
          alt={member.alt}
          fill
          loading="lazy"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg,var(--image-gradient-to),var(--image-overlay-medium),transparent)",
          }}
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <p className="font-heading text-lg leading-tight text-white sm:text-xl">{member.name}</p>
        <p className="mt-1 text-xs text-white/85 sm:text-sm">{member.role}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {member.specialties.map((specialty) => (
            <span
              key={`${member.name}-${specialty}`}
              className="rounded-full border border-[var(--cyan)]/55 bg-black/35 px-2.5 py-1 text-xs text-white/95 backdrop-blur-sm"
            >
              {specialty}
            </span>
          ))}
        </div>
        <div className="mt-3">
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 text-xs font-medium text-[var(--cyan)] transition-colors duration-300 hover:text-white sm:text-sm"
            aria-label={`Contact ${member.name}`}
          >
            <BriefcaseBusiness className="h-4 w-4" />
            Work With {member.name.split(" ")[0]}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );

  return (
    <section id="team" className="mx-auto mt-8 w-full max-w-6xl px-4 sm:px-6 md:mt-12 md:px-10">
      <motion.div
        className="text-center"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--cyan)]">Team</p>
        <h2 className="mt-3 text-2xl text-[var(--white)] sm:text-4xl">The People Behind The Build</h2>
      </motion.div>

      <div
        ref={trackRef}
        className="relative mt-7 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        onPointerDown={() => setIsPaused(true)}
        onPointerUp={() => setIsPaused(false)}
      >
        <div className="flex w-max gap-4 pb-1 sm:gap-5">
          {marqueeTeam.map((member, index) => (
            <div
              key={`${member.name}-${index}`}
              className="w-[86vw] max-w-[300px] shrink-0 snap-start sm:w-[320px] lg:w-[340px]"
            >
              {renderMemberCard(member, index, member.name)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
