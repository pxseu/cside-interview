import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

export interface PageHeaderProps {
	title: string;
	description?: string;
	children?: ReactNode;
	className?: string;
}

export function PageHeader({
	title,
	description,
	children,
	className,
}: PageHeaderProps) {
	return (
		<div
			className={cn("space-y-6 pb-8 border-b border-zinc-800/50", className)}
		>
			<div className="space-y-4">
				<h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100">
					{title}
				</h1>
				{description && (
					<p className="text-lg text-zinc-400 max-w-3xl leading-relaxed">
						{description}
					</p>
				)}
			</div>
			{children && (
				<div className="flex flex-col sm:flex-row gap-4">{children}</div>
			)}
		</div>
	);
}
