"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  BadgeCheck,
  Briefcase,
  CheckCircle,
  ChevronDown,
  DollarSign,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  Phone,
  Send,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { slideInLeft, slideInRight, staggerItem, VIEWPORT_ONCE } from "@/lib/motion";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  budget: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;
type FieldName = keyof FormData;

const socials = [
  {
    label: "WhatsApp Channel",
    href: "https://whatsapp.com/channel/0029Vb8BAyd0G0XYpCcddb3o",
    icon: MessageCircle,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/slimcybertech?igsh=ZzRscWRlNWlvdjZk",
    icon: BadgeCheck,
  },
];

const subjects = [
  "Select a Service...",
  "Software Development",
  "Mobile App Development",
  "Cybersecurity",
  "Data Analysis",
  "Cloud & DevOps",
  "UI/UX Design",
  "Tech Consulting",
  "Other",
];

const budgets = [
  "Select Budget Range...",
  "Under UGX 250,000",
  "UGX 250,000 - UGX 550,000",
  "UGX 550,000 - UGX 750,000",
  "UGX 1000,000+",
  "Let's Discuss",
];

const requiredFields: FieldName[] = ["firstName", "lastName", "email", "subject", "message"];

const fieldIcons: Record<FieldName, React.ComponentType<{ className?: string }>> = {
  firstName: User,
  lastName: User,
  email: Mail,
  phone: Phone,
  subject: Briefcase,
  budget: DollarSign,
  message: MessageSquare,
};

const fieldLabels: Record<FieldName, string> = {
  firstName: "First Name",
  lastName: "Last Name",
  email: "Email",
  phone: "Phone",
  subject: "Subject",
  budget: "Budget Range",
  message: "Message",
};

const fieldTypeMap: Partial<Record<FieldName, string>> = {
  firstName: "text",
  lastName: "text",
  email: "email",
  phone: "tel",
};

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    budget: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [focusedField, setFocusedField] = useState<FieldName | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [completionPercent, setCompletionPercent] = useState(0);
  const [isTypingMessage, setIsTypingMessage] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const typingTimeout = useRef<number | null>(null);
  const resetTimeout = useRef<number | null>(null);
  const toastTimeout = useRef<number | null>(null);

  const validateField = (field: FieldName, value: string): string => {
    const trimmed = value.trim();

    if (field === "firstName" || field === "lastName") {
      if (!trimmed) return `${fieldLabels[field]} is required`;
      if (trimmed.length < 2) return `${fieldLabels[field]} must be at least 2 characters`;
      return "";
    }

    if (field === "email") {
      if (!trimmed) return "Email is required";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) return "Please enter a valid email address";
      return "";
    }

    if (field === "phone") {
      if (!trimmed) return "";
      const phoneRegex = /^[+]?[\d\s\-()]{7,20}$/;
      if (!phoneRegex.test(trimmed)) return "Please enter a valid phone number";
      return "";
    }

    if (field === "subject") {
      if (!trimmed) return "Please select a service";
      return "";
    }

    if (field === "message") {
      if (!trimmed) return "Message is required";
      if (trimmed.length < 20) return "Message should be at least 20 characters";
      if (trimmed.length > 500) return "Message must not exceed 500 characters";
      return "";
    }

    return "";
  };

  const validateAll = (): FormErrors => {
    const newErrors: FormErrors = {};
    (Object.keys(formData) as FieldName[]).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    return newErrors;
  };

  const updateField = (field: FieldName, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "message") {
      setCharCount(value.length);
      setIsTypingMessage(true);
      if (typingTimeout.current) window.clearTimeout(typingTimeout.current);
      typingTimeout.current = window.setTimeout(() => {
        setIsTypingMessage(false);
      }, 1500);
    }
  };

  const handleBlur = (field: FieldName) => {
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: error || undefined }));
    setFocusedField((prev) => (prev === field ? null : prev));
  };

  const handleSubmit = async () => {
    const newErrors = validateAll();
    setErrors(newErrors);
    setSubmitError(null);

    if (Object.keys(newErrors).length > 0) {
      setIsShaking(true);
      window.setTimeout(() => setIsShaking(false), 380);
      return;
    }

    setIsSubmitting(true);
    setIsSuccess(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        throw new Error(payload?.error || "Unable to send your message right now.");
      }

      setIsSuccess(true);
      setShowToast(true);

      if (resetTimeout.current) window.clearTimeout(resetTimeout.current);
      if (toastTimeout.current) window.clearTimeout(toastTimeout.current);

      resetTimeout.current = window.setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          subject: "",
          budget: "",
          message: "",
        });
        setCharCount(0);
        setErrors({});
      }, 3000);

      toastTimeout.current = window.setTimeout(() => {
        setShowToast(false);
      }, 4000);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to send your message right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const completedRequired = requiredFields.filter((field) => formData[field].trim().length > 0).length;
    setCompletionPercent(Math.round((completedRequired / requiredFields.length) * 100));
  }, [formData]);

  useEffect(() => {
    return () => {
      if (typingTimeout.current) window.clearTimeout(typingTimeout.current);
      if (resetTimeout.current) window.clearTimeout(resetTimeout.current);
      if (toastTimeout.current) window.clearTimeout(toastTimeout.current);
    };
  }, []);

  const messageCountClass = useMemo(() => {
    if (charCount > 500) return "text-red-400";
    if (charCount >= 400) return "text-[var(--cyan)]";
    return "text-[var(--muted)]";
  }, [charCount]);

  const fieldBaseClasses =
    "peer w-full rounded-[10px] border bg-[var(--bg)] px-4 py-[15px] text-sm text-[var(--white)] outline-none transition-all duration-200 placeholder:text-[var(--muted)]";

  const renderField = (field: FieldName, isTextarea = false, isSelect = false, options: string[] = []) => {
    const Icon = fieldIcons[field];
    const hasValue = formData[field].trim().length > 0;
    const isFocused = focusedField === field;
    const hasError = Boolean(errors[field]);
    const showFloating = isSelect || isFocused || hasValue;

    const borderClass = hasError ? "border-[#ef4444]" : "border-[var(--border)]";
    const focusClass = hasError
      ? "focus:border-[#ef4444] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
      : "focus:border-[var(--cyan)] focus:shadow-[0_0_0_3px_rgba(0,198,255,0.1)]";

    return (
      <div className="relative">
        <div className="relative overflow-visible">
          {isTextarea ? (
            <textarea
              value={formData[field]}
              onChange={(event) => updateField(field, event.target.value)}
              onFocus={() => setFocusedField(field)}
              onBlur={() => handleBlur(field)}
              rows={6}
              className={`${fieldBaseClasses} min-h-[140px] resize-y pt-5 ${borderClass} ${focusClass}`}
              placeholder=""
            />
          ) : isSelect ? (
            <div className="relative">
              <select
                value={formData[field]}
                onChange={(event) => updateField(field, event.target.value)}
                onFocus={() => setFocusedField(field)}
                onBlur={() => handleBlur(field)}
                className={`${fieldBaseClasses} appearance-none pt-5 pr-10 ${borderClass} ${focusClass}`}
              >
                {options.map((option, index) => (
                  <option
                    key={`${field}-option-${option}`}
                    value={index === 0 ? "" : option}
                    className="bg-[var(--surface)] text-[var(--white)]"
                  >
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-soft)]" />
            </div>
          ) : (
            <input
              type={fieldTypeMap[field] || "text"}
              value={formData[field]}
              onChange={(event) => updateField(field, event.target.value)}
              onFocus={() => setFocusedField(field)}
              onBlur={() => handleBlur(field)}
              className={`${fieldBaseClasses} ${borderClass} ${focusClass}`}
              placeholder=""
            />
          )}

          <label
            className={`pointer-events-none absolute left-4 z-10 flex items-center gap-1.5 text-xs transition-all duration-200 ${
              showFloating
                ? "-top-3 translate-y-0 rounded bg-[var(--card-bg)] px-1.5 text-[11px] text-[var(--cyan)]"
                : "top-1/2 -translate-y-1/2 text-[var(--muted-soft)]"
            }`}
          >
            {showFloating && <Icon className="h-3.5 w-3.5" />}
            {fieldLabels[field]}
          </label>

          <span className="pointer-events-none absolute inset-0 rounded-[10px] bg-[radial-gradient(circle_at_var(--x,50%)_var(--y,50%),rgba(0,198,255,0.08),transparent_45%)] opacity-0 transition-opacity duration-300 peer-focus:opacity-100" />
        </div>

        <AnimatePresence>
          {hasError && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="mt-1.5 flex items-center gap-1 text-xs text-red-400"
            >
              <AlertCircle className="h-3.5 w-3.5" />
              {errors[field]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <section
      id="contact"
      aria-label="Contact Us"
      className="relative mt-8 overflow-hidden bg-[var(--bg)] px-4 py-12 sm:px-5 md:mt-6 md:px-8 md:py-14"
      style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, var(--grid-line) 1px, transparent 0)",
        backgroundSize: "22px 22px",
      }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--cyan),transparent)]" />
      <div className="pointer-events-none absolute left-[-12%] top-1/2 h-[360px] w-[360px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,198,255,0.08),rgba(0,114,255,0.04),transparent_70%)] blur-3xl md:h-[520px] md:w-[520px]" />
      <p
        className="pointer-events-none absolute inset-x-0 -top-5 hidden select-none text-center font-heading text-[84px] leading-none tracking-[0.14em] md:block lg:text-[102px]"
        style={{ color: "color-mix(in srgb, var(--white) 8%, transparent)" }}
      >
        CONTACT
      </p>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="fixed left-4 right-4 top-5 z-[120] mx-auto flex w-full max-w-md items-center gap-2 rounded-xl border border-[#1f3f2a] border-l-4 border-l-[#10b981] bg-[var(--card-bg)] px-4 py-3 text-sm text-[var(--white)] shadow-xl"
          >
            <CheckCircle className="h-4 w-4 text-[#10b981]" />
            We&apos;ll be in touch within 24 hours!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-[45%_55%] md:gap-10">
        <motion.div
          variants={slideInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="relative z-10 text-center md:text-left"
        >
          <div className="flex items-center justify-center gap-3 md:justify-start">
            <span className="h-px w-12 bg-[var(--cyan)]/80" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cyan)]">
              GET IN TOUCH
            </p>
          </div>

          <h2 className="mt-5 font-heading text-2xl leading-tight text-[var(--white)] sm:text-3xl md:text-4xl">
            Let&apos;s Build Something
            <br />
            <span className="bg-[linear-gradient(90deg,var(--cyan),var(--blue))] bg-clip-text text-transparent">
              Extraordinary
            </span>{" "}
            Together
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[var(--muted-strong)] md:mx-0 md:text-base">
            Have a project in mind? We&apos;d love to hear about it. Send us a message and
            we&apos;ll get back to you within 24 hours.
          </p>

          <div className="mt-7 space-y-3">
            {[
              { icon: MapPin, label: "Location", value: "West Nile, Uganda" },
              {
                icon: Mail,
                label: "Email",
                value: "info@slimcybertech.com",
              },
              { icon: Phone, label: "Phone", value: "+256 772 581510" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                variants={staggerItem}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT_ONCE}
                className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card-bg-strong)] p-3 sm:p-4 md:p-4"
              >
                <span className="absolute left-0 top-0 h-full w-1 origin-top scale-y-0 bg-[var(--gradient)] transition-transform duration-300 group-hover:scale-y-100" />
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--gradient)]">
                    <item.icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--muted-soft)]">
                      {item.label}
                    </p>
                    <p className="break-all text-sm text-[var(--white)]">{item.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-7">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-strong)]">Follow Us</p>
            <div className="mt-3 flex items-center justify-center gap-3 md:justify-start">
              {socials.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card-bg-strong)] text-[var(--muted-soft)] transition-all duration-300 hover:scale-110 hover:border-[var(--cyan)] hover:text-[var(--cyan)] hover:shadow-[0_0_16px_rgba(0,198,255,0.25)]"
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-7 flex justify-center md:justify-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#1a3a1a] bg-[var(--card-bg-strong)] px-3 py-1.5 text-xs text-green-400">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              Available for new projects
            </span>
          </div>
        </motion.div>

        <motion.div
          variants={slideInRight}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          animate={isShaking ? { x: [0, -8, 8, -8, 0] } : { x: 0 }}
          className="relative z-10"
        >
          <div className="overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--card-bg)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-colors duration-300 hover:border-[var(--cyan)]/30 sm:p-5 md:p-10">
            <div className="mb-5">
              <div className="mb-2 flex items-center justify-between text-xs text-[var(--muted-soft)]">
                <span>Form completion</span>
                <span className="text-[var(--cyan)]">{completionPercent}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--track-muted)]">
                <motion.div
                  animate={{ width: `${completionPercent}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-[var(--gradient)]"
                />
              </div>
            </div>

            <h3 className="font-heading text-xl text-[var(--white)]">Send Us A Message</h3>
            <div className="mt-2 h-[2px] w-10 bg-[var(--gradient)]" />

            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {renderField("firstName")}
                {renderField("lastName")}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {renderField("email")}
                {renderField("phone")}
              </div>

              {renderField("subject", false, true, subjects)}
              {renderField("budget", false, true, budgets)}

              <div>
                {renderField("message", true)}
                <div className={`mt-1 text-right text-xs ${messageCountClass}`}>
                  {charCount} / 500
                </div>

                <AnimatePresence>
                  {isTypingMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="mt-2 flex items-center gap-2 text-xs text-[var(--muted)]"
                    >
                      <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--cyan)] animate-bounce [animation-delay:0ms]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--cyan)] animate-bounce [animation-delay:120ms]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--cyan)] animate-bounce [animation-delay:240ms]" />
                      </span>
                      SlimCyberTech is ready to hear your idea...
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.02 } : undefined}
                whileTap={!isSubmitting ? { scale: 0.99 } : undefined}
                className={`relative inline-flex h-[52px] w-full items-center justify-center overflow-hidden rounded-[10px] px-4 font-heading text-sm font-semibold text-white transition-all ${
                  isSuccess
                    ? "bg-[linear-gradient(135deg,#10b981,#059669)]"
                    : "bg-[linear-gradient(135deg,#00c6ff,#0072ff)]"
                } disabled:cursor-not-allowed disabled:opacity-80`}
                style={{
                  boxShadow: isSubmitting
                    ? "none"
                    : "0 8px 30px rgba(0, 198, 255, 0.15)",
                }}
              >
                <motion.span
                  className="pointer-events-none absolute inset-y-0 left-[-35%] w-[30%] bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.35),transparent)]"
                  animate={{ x: ["0%", "380%"] }}
                  transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                />

                {isSubmitting ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                ) : isSuccess ? (
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Message Sent!
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    Send Message
                    <motion.span whileHover={{ x: 4 }}>
                      <Send className="h-4 w-4" />
                    </motion.span>
                  </span>
                )}
              </motion.button>

              {submitError && <p className="text-sm text-red-400">{submitError}</p>}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
