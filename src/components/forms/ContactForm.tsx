"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().optional(),
  subject: z.string().trim().optional(),
  message: z.string().trim().min(1, "Please add a short message"),
  website: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactForm() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactFormSchema) });

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Unable to send your message.");
      }
      setSuccess(true);
      reset();
      toast("Your message has been sent.", "success");
    } catch (error) {
      toast(
        error instanceof Error ? error.message : "Something went wrong.",
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-5 border border-ikasa-red/30 bg-ikasa-black px-8 py-16 text-center text-ikasa-warm-white"
      >
        <CheckCircle2 className="h-12 w-12 text-ikasa-red" />
        <h3 className="font-heading text-2xl tracking-tight sm:text-3xl">
          Message Sent
        </h3>
        <p className="max-w-md text-sm leading-relaxed text-ikasa-light-grey/85">
          Thank you for reaching out. Our team will respond as soon as
          possible.
        </p>
        <Button variant="outline" onClick={() => setSuccess(false)}>
          Send Another Message
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Name" error={errors.name?.message}>
          <input className={inputClass} {...register("name")} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input type="email" className={inputClass} {...register("email")} />
        </Field>
        <Field label="Phone" optional>
          <input type="tel" className={inputClass} {...register("phone")} />
        </Field>
        <Field label="Subject" optional>
          <input className={inputClass} {...register("subject")} />
        </Field>
      </div>

      <Field label="Message" error={errors.message?.message}>
        <textarea rows={5} className={inputClass} {...register("message")} />
      </Field>

      <MagneticButton type="submit" disabled={submitting}>
        <span
          className={cn(
            "inline-flex h-14 items-center justify-center gap-2 bg-ikasa-red px-8 font-label text-sm uppercase tracking-[0.14em] text-ikasa-white transition-colors hover:bg-ikasa-deep-red",
            submitting && "opacity-70",
          )}
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {submitting ? "Sending..." : "Send Message"}
        </span>
      </MagneticButton>
    </form>
  );
}

const inputClass =
  "w-full border border-ikasa-light-grey bg-white px-4 py-3 text-sm text-ikasa-black outline-none transition-colors placeholder:text-ikasa-medium-grey/70 focus:border-ikasa-red";

function Field({
  label,
  error,
  optional,
  children,
}: {
  label: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between font-label text-[0.65rem] tracking-[0.18em] text-ikasa-charcoal">
        {label}
        {optional ? (
          <span className="normal-case tracking-normal text-ikasa-medium-grey/70">
            optional
          </span>
        ) : null}
      </span>
      {children}
      <AnimatePresence>
        {error ? (
          <motion.span
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 block text-xs text-ikasa-red"
          >
            {error}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </label>
  );
}
