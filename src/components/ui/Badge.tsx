import { cn } from "@/utils/cn";
import type { HTMLAttributes, ReactNode } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
	children: ReactNode;
	variant?: "default" | "success" | "warning" | "error";
}

export function Badge({
	children,
	variant = "default",
	className,
	...props
}: BadgeProps) {
	return (
		<span
			className={cn(
				"inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border",
				{
					"bg-zinc-800/50 text-zinc-300 border-zinc-700": variant === "default",
					"bg-green-900/50 text-green-300 border-green-800":
						variant === "success",
					"bg-yellow-900/50 text-yellow-300 border-yellow-800":
						variant === "warning",
					"bg-red-900/50 text-red-300 border-red-800": variant === "error",
				},
				className,
			)}
			{...props}
		>
			{children}
		</span>
	);
}
