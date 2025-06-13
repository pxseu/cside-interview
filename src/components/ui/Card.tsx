import { cn } from "@/utils/cn";
import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
	return (
		<div
			className={cn(
				"bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-6",
				"shadow-lg shadow-black/10 hover:border-zinc-700/50 transition-colors",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}
