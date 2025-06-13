import { cn } from "@/utils/cn";
import type { HTMLAttributes, ReactNode } from "react";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	size?: "sm" | "md" | "lg" | "xl";
}

export function Container({
	children,
	size = "lg",
	className,
	...props
}: ContainerProps) {
	return (
		<div
			className={cn(
				"mx-auto px-4 sm:px-6 lg:px-8",
				{
					"max-w-2xl": size === "sm",
					"max-w-4xl": size === "md",
					"max-w-6xl": size === "lg",
					"max-w-7xl": size === "xl",
				},
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}
