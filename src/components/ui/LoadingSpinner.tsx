import { cn } from "@/utils/cn";
import type { HTMLAttributes } from "react";

export interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
	size?: number | "sm" | "md" | "lg" | "xl";
}

export function LoadingSpinner({
	size = "md",
	className,
	...props
}: LoadingSpinnerProps) {
	const sizeValue =
		typeof size === "number"
			? size
			: size === "sm"
				? 16
				: size === "md"
					? 24
					: size === "lg"
						? 32
						: size === "xl"
							? 48
							: 24;

	return (
		<div className={cn("inline-block animate-spin", className)} {...props}>
			<svg
				width={sizeValue}
				height={sizeValue}
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<title>Loading</title>
				<circle
					cx="12"
					cy="12"
					r="10"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeDasharray="32"
					strokeDashoffset="32"
					className="text-zinc-600"
				/>
				<circle
					cx="12"
					cy="12"
					r="10"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeDasharray="32"
					strokeDashoffset="24"
					className="text-zinc-400"
				/>
			</svg>
		</div>
	);
}
