import { cn } from "@/lib/utils";

/**
 * Centered page-width wrapper used across the site (navbar, sections, pages).
 * Caps at max-w-7xl and steps up on very large monitors to stay aligned.
 */
export default function Container({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1600px] 3xl:max-w-[1800px] 4xl:max-w-[2000px]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
