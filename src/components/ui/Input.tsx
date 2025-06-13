import { cn } from "@/utils/cn";
import { type InputHTMLAttributes, useId } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
}

export function Input({ label, className, ...props }: InputProps) {
	const inputId = useId();

	return (
		<div className="space-y-2">
			{label && (
				<label
					htmlFor={inputId}
					className="block text-sm font-medium text-zinc-300"
				>
					{label}
				</label>
			)}
			<input
				id={inputId}
				className={cn(
					"w-full px-3 py-2 text-sm",
					"bg-zinc-900/50 border border-zinc-700 rounded-md",
					"text-zinc-100 placeholder:text-zinc-500",
					"focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500",
					"transition-colors",
					className,
				)}
				{...props}
			/>
		</div>
	);
}
