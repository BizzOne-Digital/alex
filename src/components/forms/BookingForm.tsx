"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ImagePlus, Loader2, X } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

const MAX_PHOTOS = 6;
const MAX_PHOTO_SIZE = 8 * 1024 * 1024;

const propertyTypes = ["House", "Condo", "Townhouse", "Other"];
const timeSlots = [
  "Morning (9am–12pm)",
  "Afternoon (12pm–4pm)",
  "Evening (4pm–7pm)",
];

const bookingFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(7, "Phone number is required"),
  address: z.string().trim().optional(),
  city: z.string().trim().optional(),
  province: z.string().trim().optional(),
  postalCode: z.string().trim().optional(),
  service: z.string().optional(),
  propertyType: z.string().optional(),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  alternateDate: z.string().optional(),
  alternateTime: z.string().optional(),
  projectDetails: z.string().trim().max(5000).optional(),
  message: z.string().trim().max(5000).optional(),
  website: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

export type BookingServiceOption = {
  id: string;
  title: string;
  slug: string;
};

type BookingFormProps = {
  services: BookingServiceOption[];
  bookingMessage?: string;
};

export function BookingForm({ services, bookingMessage }: BookingFormProps) {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
  });

  const photoPreviews = useMemo(
    () => photos.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [photos],
  );

  const onFilesSelected = (fileList: FileList | null) => {
    if (!fileList) return;
    const incoming = Array.from(fileList).filter(
      (f) => f.type.startsWith("image/") && f.size <= MAX_PHOTO_SIZE,
    );
    setPhotos((prev) => [...prev, ...incoming].slice(0, MAX_PHOTOS));
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: BookingFormValues) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;
        formData.append(key, String(value));
      });

      const service = services.find((s) => s.id === values.service);
      if (service) {
        formData.set("serviceName", service.title);
      }

      photos.forEach((file) => formData.append("photos", file));

      const res = await fetch("/api/bookings", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Unable to submit your request.");
      }

      setSuccess(true);
      reset();
      setPhotos([]);
      toast("Your consultation request has been received.", "success");
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
          Request Received
        </h3>
        <p className="max-w-md text-sm leading-relaxed text-ikasa-light-grey/85">
          {bookingMessage ||
            "Your selected date and time is a requested appointment. An Ikasa Renovations team member will contact you to confirm availability."}
        </p>
        <Button variant="outline" onClick={() => setSuccess(false)}>
          Submit Another Request
        </Button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-10"
      noValidate
    >
      {/* Honeypot */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <fieldset className="grid gap-6 sm:grid-cols-2">
        <legend className="mb-2 font-label text-[0.68rem] tracking-[0.2em] text-ikasa-red sm:col-span-2">
          Your Details
        </legend>
        <Field label="First Name" error={errors.firstName?.message}>
          <input className={inputClass} {...register("firstName")} />
        </Field>
        <Field label="Last Name" error={errors.lastName?.message}>
          <input className={inputClass} {...register("lastName")} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input type="email" className={inputClass} {...register("email")} />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <input type="tel" className={inputClass} {...register("phone")} />
        </Field>
      </fieldset>

      <fieldset className="grid gap-6 sm:grid-cols-2">
        <legend className="mb-2 font-label text-[0.68rem] tracking-[0.2em] text-ikasa-red sm:col-span-2">
          Property
        </legend>
        <Field label="Address" optional>
          <input className={inputClass} {...register("address")} />
        </Field>
        <Field label="City" optional>
          <input className={inputClass} {...register("city")} />
        </Field>
        <Field label="Province" optional>
          <input className={inputClass} {...register("province")} />
        </Field>
        <Field label="Postal Code" optional>
          <input className={inputClass} {...register("postalCode")} />
        </Field>
        <Field label="Property Type" optional>
          <select className={inputClass} {...register("propertyType")}>
            <option value="">Select property type</option>
            {propertyTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Project Type" optional>
          <select className={inputClass} {...register("service")}>
            <option value="">Select a service</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </Field>
      </fieldset>

      <fieldset className="grid gap-6 sm:grid-cols-2">
        <legend className="mb-2 font-label text-[0.68rem] tracking-[0.2em] text-ikasa-red sm:col-span-2">
          Preferred Timing
        </legend>
        <Field label="Preferred Date" optional>
          <input type="date" className={inputClass} {...register("preferredDate")} />
        </Field>
        <Field label="Preferred Time" optional>
          <select className={inputClass} {...register("preferredTime")}>
            <option value="">Select a window</option>
            {timeSlots.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Alternate Date" optional>
          <input type="date" className={inputClass} {...register("alternateDate")} />
        </Field>
        <Field label="Alternate Time" optional>
          <select className={inputClass} {...register("alternateTime")}>
            <option value="">Select a window</option>
            {timeSlots.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="mb-2 font-label text-[0.68rem] tracking-[0.2em] text-ikasa-red">
          Project Details
        </legend>
        <Field label="Tell us about your project" optional>
          <textarea
            rows={4}
            className={inputClass}
            placeholder="Goals, constraints, must-haves..."
            {...register("projectDetails")}
          />
        </Field>
        <Field label="Anything else?" optional>
          <textarea
            rows={3}
            className={inputClass}
            {...register("message")}
          />
        </Field>

        <div>
          <p className="mb-3 font-label text-[0.65rem] tracking-[0.18em] text-ikasa-medium-grey">
            Photos of your current space (optional, up to {MAX_PHOTOS})
          </p>
          <div className="flex flex-wrap gap-3">
            {photoPreviews.map((p, i) => (
              <div
                key={p.url}
                className="group relative h-24 w-24 overflow-hidden border border-ikasa-light-grey"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.url}
                  alt={`Upload preview ${i + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center bg-ikasa-black/80 text-ikasa-white opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Remove photo"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            {photos.length < MAX_PHOTOS ? (
              <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1.5 border border-dashed border-ikasa-light-grey text-ikasa-medium-grey transition-colors hover:border-ikasa-red hover:text-ikasa-red">
                <ImagePlus className="h-5 w-5" />
                <span className="font-label text-[0.55rem] tracking-[0.14em]">
                  Add photo
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => onFilesSelected(e.target.files)}
                />
              </label>
            ) : null}
          </div>
        </div>
      </fieldset>

      <div className="flex flex-col items-start gap-4 border-t border-ikasa-light-grey pt-8">
        <p className="text-xs leading-relaxed text-ikasa-medium-grey">
          {bookingMessage ||
            "Your selected date and time is a requested appointment. An Ikasa Renovations team member will contact you to confirm availability before your consultation is confirmed."}
        </p>
        <MagneticButton type="submit" disabled={submitting}>
          <span className={cn("inline-flex items-center justify-center gap-2 bg-ikasa-red px-8 h-14 font-label text-sm tracking-[0.14em] uppercase text-ikasa-white transition-colors hover:bg-ikasa-deep-red", submitting && "opacity-70")}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {submitting ? "Sending..." : "Request Consultation"}
          </span>
        </MagneticButton>
      </div>
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
          <span className="text-ikasa-medium-grey/70 normal-case tracking-normal">
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
