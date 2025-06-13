import { cn } from "@/utils/cn";
import { Calendar } from "lucide-react";

export interface DateDisplayProps {
	date: string | Date;
	showIcon?: boolean;
	locale?: string;
	className?: string;
}

export function DateDisplay({
	date,
	showIcon = true,
	locale,
	className,
}: DateDisplayProps) {
	const dateObj = new Date(date);

	if (Number.isNaN(dateObj.getTime())) {
		return (
			<div
				className={cn(
					"flex items-center gap-1 text-sm text-zinc-500",
					className,
				)}
			>
				{showIcon && <Calendar className="w-3 h-3" />}
				<span>Invalid date</span>
			</div>
		);
	}

	const formattedDate = new Intl.DateTimeFormat(locale, {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(dateObj);

	return (
		<div
			className={cn("flex items-center gap-1 text-sm text-zinc-500", className)}
			title={new Intl.DateTimeFormat(locale, {
				weekday: "long",
				month: "long",
				day: "numeric",
				year: "numeric",
			}).format(dateObj)}
		>
			{showIcon && <Calendar className="w-3 h-3" />}
			<span>{formattedDate}</span>
		</div>
	);
}
