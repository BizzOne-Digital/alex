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

const quoteFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().optional(),
  quantity: z.coerce.number().int().min(1).max(999).optional(),
  message: z.string().trim().max(5000).optional(),
  website: z.string().optional(),
});

type QuoteFormValues = z.infer<typeof quoteFormSchema>;

type QuoteFormProps = {
  productId?: string;
  productTitle?: string;
  onSuccess?: () => void;
};

export function QuoteForm({ productId, productTitle, onSuccess }: QuoteFormProps) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: { quantity: 1 },
  });

  const onSubmit = async (values: QuoteFormValues) => {
    if (!productId) {
      toast("Select a product before requesting a quote.", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          quantity: values.quantity || 1,
          product: productId,
          productTitle: productTitle || "",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Unable to submit your quote request.");
      }
      setSuccess(true);
      reset();
      toast("Quote request submitted.", "success");
      onSuccess?.();
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
        className="flex flex-col items-center gap-4 border border-ikasa-red/30 bg-ikasa-black px-6 py-12 text-center text-ikasa-warm-white"
      >
        <CheckCircle2 className="h-10 w-10 text-ikasa-red" />
        <h3 className="font-heading text-xl tracking-tight">Quote Requested</h3>
        <p className="max-w-sm text-sm leading-relaxed text-ikasa-light-grey/85">
          Thank you — our team will follow up with pricing and availability.
        </p>
        <Button variant="outline" size="sm" onClick={() => setSuccess(false)}>
          Request Another Quote
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor="quote-website">Website</label>
        <input id="quote-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" error={errors.name?.message}>
          <input className={inputClass} {...register("name")} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input type="email" className={inputClass} {...register("email")} />
        </Field>
        <Field label="Phone" optional>
          <input type="tel" className={inputClass} {...register("phone")} />
        </Field>
        <Field label="Quantity" optional>
          <input type="number" min={1} className={inputClass} {...register("quantity")} />
        </Field>
      </div>

      <Field label="Message" optional>
        <textarea
          rows={4}
          className={inputClass}
          placeholder="Finish preferences, dimensions, installation questions..."
          {...register("message")}
        />
      </Field>

      <MagneticButton type="submit" disabled={submitting}>
        <span
          className={cn(
            "inline-flex h-12 items-center justify-center gap-2 bg-ikasa-red px-7 font-label text-xs uppercase tracking-[0.14em] text-ikasa-white transition-colors hover:bg-ikasa-deep-red",
            submitting && "opacity-70",
          )}
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {submitting ? "Sending..." : "Request Quote"}
        </span>
      </MagneticButton>
    </form>
  );
}

const inputClass =
  "w-full border border-ikasa-light-grey bg-white px-4 py-2.5 text-sm text-ikasa-black outline-none transition-colors placeholder:text-ikasa-medium-grey/70 focus:border-ikasa-red";

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
      <span className="mb-1.5 flex items-center justify-between font-label text-[0.62rem] tracking-[0.18em] text-ikasa-charcoal">
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
