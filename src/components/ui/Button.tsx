import { cn } from "@/utils/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
}

export function Button({ children, className, ...props }: ButtonProps) {
	return (
		<button
			className={cn(
				"inline-flex items-center justify-center px-4 py-2 text-sm font-medium",
				"bg-zinc-900 text-zinc-100 border border-zinc-700 rounded-md",
				"hover:bg-zinc-800 hover:border-zinc-600 transition-colors",
				"focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-950",
				"disabled:opacity-50 disabled:cursor-not-allowed",
				className,
			)}
			{...props}
		>
			{children}
		</button>
	);
}
