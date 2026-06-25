"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { fadeUp, staggerItem, VIEWPORT_ONCE } from "@/lib/motion";

type TeamMember = {
  name: string;
  role: string;
  image: string;
  alt: string;
  specialties: string[];
  bio: string;
  email?: string;
  whatsapp: string; 
  /** Tailwind object-* position when using object-cover (e.g. object-top for tall portraits). */
  imagePosition?: string;
};

const team: TeamMember[] = [
{
    name: "Lema Aaron",
    role: "Software Engineer",
    image: "/images/Lema.jpeg",
    alt: "Lema Aaron portrait",
    specialties: ["Leadership", "Software Engineer"],
    bio: `Technical Lead Developer at SlimCyberTech with expertise in software engineering, AI, machine learning, business process automation, web and mobile application development, networking, and enterprise systems architecture.`,
    email: "info@slimcybertech.com",
    whatsapp: "https://wa.me/256772581510",
  },
   {
    name: "Sebabe Swaleh",
    role: "Senior Software Engineer",
    image: "/images/Sebabe.jpeg",
    alt: "Sebabe Swaleh",
    specialties: ["Backend Systems", "Web Applications"],
    bio: `Software Engineering student at Makerere University with a strong interest in Data Science, AI, Machine Leraning,Mobile Application and Cloud computing.My expertise includes Flutter app developmemnt,Andriod development,full stack development and building innovative technology solutions that solve real world problems.`,
    email: "swale.sebabeabdu@students.mak.ac.ug",
    whatsapp: "https://wa.me/256778544744",
  },
   {
    name: "Awongo Fahadi Rashid",
    role: "Senior Software Engineer",
    image: "/images/Awongo Fahadi Rashid.jpeg",
    alt: "Awongo Fahadi Rashid portrait",
    specialties: ["Backend Systems", "Web Applications"],
    bio: `Software Engineering student at Makerere University working across the full stack, from intuitive interfaces to robust backend systems that solve meaningful problems.`,
    email: "fahadirashidawongo@gmail.com",
    whatsapp: "https://wa.me/256764922070",
  }, 
  {
    name: "Uhuru Diana",
    role: "Senior Front-end Developer",
    image: "/images/Diana.jpg",
    alt: "Uhuru Diana portrait",
    specialties: ["Front-end Developer", "Web Applications"],
    bio: `Information Technology student at Muni University with interests in front-end development, networking and software solutions.Passionate about learning and creating impactful digital experiences`,
    email: "dianauhuru9@gmail.com",
    whatsapp: "https://wa.me/256791906404",
  },
  {
    name: "Aguta Kennedy",
    role: "Web Developer, Graphic Designer",
    image: "/images/Keno.jpeg",
    alt: "Aguta Kennedy",
    specialties: ["Web Developer", "Graphics Designer"],
    bio: `Creative web developer and graphic designer dedicated to building engaging digital products that combine technical excellence with outstanding visual design.`,
    whatsapp: "https://wa.me/256780814373",
    imagePosition: "object-top",
  },
   {
    name: "Akuma Dalil",
    role: "IT Operations & Support Specialist",
    image: "/images/Akuma Dalil.jpg",
    alt: "Akuma Dalil portrait",
    specialties: ["Infrastructure Support", "Systems Administration"],
    bio: `Dedicated IT Operations and Support Specialist passionate about delivering reliable technology solutions, strong technical support, and excellent customer satisfaction.`,
    email: "akumadalil1@gmail.com",
    whatsapp: "https://wa.me/256762099651",
  },
   {
    name: "Hussen Yang Salim",
    role: "Graphic Designer",
    image: "/images/Hussen Yang Salim.jpeg",
    alt: "Hussen Yang Salim portrait",
    specialties: ["Brand Identity", "Visual Design"],
    bio: `Creative graphic designer specializing in brand identity, visual communication, and impactful designs that help businesses stand out.`,
    email: "husseinyangs@gmail.com",
    whatsapp: "https://wa.me/256787322539",
   },
    {
    name: "Ogole Fadil Hussen",
    role: "Full Stack Developer & IT Operations Specialist",
    image: "/images/fadil.jpg",
    alt: "Ogole Fadil Hussen",
    specialties: ["Full Stack Developer" , "IT Operations Specialist"],
    bio: `Full Stack Developer & IT Operations Specialist focused on creating seamless digital experiences and optimizing IT infrastructure. Dedicated to solving complex problems through technology and innovation.`,
    email: "ogolefadilhussen@outlook.com",
    whatsapp: "https://wa.me/256789416409",
    imagePosition: "object-top",
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

  const renderMemberCard = (member: TeamMember, index: number, key: string) => (
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
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${member.imagePosition ?? ""}`}
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
      <p className="mt-2 line-clamp-3 text-xs text-white/85">{member.bio}</p>
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
    <div className="mt-4 flex flex-wrap gap-2">
  <a
    href={`mailto:${member.email}`}
    className="rounded-full border border-[var(--cyan)]/40 px-3 py-1 text-xs text-white hover:border-[var(--cyan)]"
  >
    Email
  </a>

  <a
    href={member.whatsapp}
    target="_blank"
    rel="noopener noreferrer"
    className="rounded-full border border-[var(--cyan)]/40 px-3 py-1 text-xs text-white hover:border-[var(--cyan)]"
  >
    WhatsApp
  </a>
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
