import { cn } from "@/utils/cn";
import type { HTMLAttributes } from "react";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
	src?: string;
	alt?: string;
	fallback?: string;
	size?: "sm" | "md" | "lg";
}

export function Avatar({
	src,
	alt,
	fallback,
	size = "md",
	className,
	...props
}: AvatarProps) {
	return (
		<div
			className={cn(
				"flex items-center justify-center rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden",
				"ring-2 ring-zinc-800/50",
				{
					"w-6 h-6 text-xs": size === "sm",
					"w-8 h-8 text-sm": size === "md",
					"w-12 h-12 text-lg": size === "lg",
				},
				className,
			)}
			{...props}
		>
			{src ? (
				<img src={src} alt={alt} className="w-full h-full object-cover" />
			) : (
				<span className="text-zinc-400 font-medium">{fallback}</span>
			)}
		</div>
	);
}
