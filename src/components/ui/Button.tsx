import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-ikasa-red text-ikasa-white hover:bg-ikasa-deep-red border border-transparent",
  secondary:
    "bg-ikasa-black text-ikasa-white hover:bg-ikasa-charcoal border border-transparent",
  ghost:
    "bg-transparent text-ikasa-white hover:bg-ikasa-white/10 border border-transparent",
  outline:
    "bg-transparent text-ikasa-black border border-ikasa-black/20 hover:border-ikasa-red hover:text-ikasa-red",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-xs",
  md: "h-12 px-6 text-sm",
  lg: "h-14 px-8 text-sm",
};

type SharedProps = {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

type ButtonAsButton = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = SharedProps & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  ...rest
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 font-label tracking-[0.14em] uppercase transition-colors duration-300 disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );

  if ("href" in rest && rest.href) {
    const { href, target, rel, onClick } = rest;
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        className={classes}
      >
        {children}
      </Link>
    );
  }

  const buttonProps = rest as ButtonAsButton;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
