"use client";

import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

type FieldWrapperProps = {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
  htmlFor?: string;
};

export function FieldWrapper({
  label,
  hint,
  error,
  required,
  className,
  children,
  htmlFor,
}: FieldWrapperProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <label
          htmlFor={htmlFor}
          className="font-label text-[0.68rem] tracking-[0.16em] text-neutral-400"
        >
          {label}
          {required ? <span className="ml-1 text-red-500">*</span> : null}
        </label>
      ) : null}
      {children}
      {hint && !error ? <p className="text-xs text-neutral-500">{hint}</p> : null}
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}

const baseControl =
  "w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 transition-colors focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600/40 disabled:cursor-not-allowed disabled:opacity-50";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
};

export function Input({
  label,
  hint,
  error,
  wrapperClassName,
  className,
  id,
  required,
  ...rest
}: InputProps) {
  return (
    <FieldWrapper
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={wrapperClassName}
      htmlFor={id}
    >
      <input
        id={id}
        className={cn(baseControl, error && "border-red-600", className)}
        {...rest}
      />
    </FieldWrapper>
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
};

export function Textarea({
  label,
  hint,
  error,
  wrapperClassName,
  className,
  id,
  required,
  rows = 4,
  ...rest
}: TextareaProps) {
  return (
    <FieldWrapper
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={wrapperClassName}
      htmlFor={id}
    >
      <textarea
        id={id}
        rows={rows}
        className={cn(baseControl, "resize-y", error && "border-red-600", className)}
        {...rest}
      />
    </FieldWrapper>
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
};

export function Select({
  label,
  hint,
  error,
  wrapperClassName,
  className,
  id,
  required,
  options,
  placeholder,
  ...rest
}: SelectProps) {
  return (
    <FieldWrapper
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={wrapperClassName}
      htmlFor={id}
    >
      <select
        id={id}
        className={cn(baseControl, "cursor-pointer", error && "border-red-600", className)}
        {...rest}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}

type ToggleProps = {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
};

export function Toggle({ label, description, checked, onChange, disabled, className }: ToggleProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start justify-between gap-4 rounded-md border border-neutral-800 bg-neutral-900/60 px-3 py-2.5",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <span>
        <span className="block text-sm text-neutral-200">{label}</span>
        {description ? <span className="block text-xs text-neutral-500">{description}</span> : null}
      </span>
      <span
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
          checked ? "bg-red-600" : "bg-neutral-700",
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 translate-x-0.5 rounded-full bg-white transition-transform",
            checked && "translate-x-[18px]",
          )}
        />
      </span>
    </label>
  );
}
