import { cn } from "@/utils/cn";
import type { routesQuery$data } from "../../utils/relay/__generated__/routesQuery.graphql";

// Use generated types from GraphQL - handle nullable labels properly
type LabelNode = NonNullable<
	NonNullable<
		NonNullable<
			NonNullable<
				NonNullable<routesQuery$data["repository"]>["issues"]["nodes"]
			>[number]
		>["labels"]
	>["nodes"]
>[number];
export type Label = NonNullable<LabelNode>;

export interface IssueLabelsProps {
	labels: (Label | null | undefined)[];
	variant?: "default" | "colored";
	size?: "sm" | "md";
	maxDisplay?: number;
	className?: string;
}

export function IssueLabels({
	labels,
	maxDisplay = 5,
	variant = "default",
	size = "sm",
	className,
}: IssueLabelsProps) {
	const validLabels = labels.filter(Boolean) as Label[];

	if (validLabels.length === 0) {
		return null;
	}

	const visibleLabels = validLabels.slice(0, maxDisplay);
	const remainingCount = validLabels.length - maxDisplay;

	const baseClasses = cn(
		"inline-flex items-center font-medium rounded-md border",
		{
			"px-2 py-1 text-xs": size === "sm",
			"px-3 py-1.5 text-sm": size === "md",
		},
	);

	const getDefaultClasses = () =>
		cn(baseClasses, "bg-zinc-800/50 text-zinc-300 border-zinc-700/50");

	const getColoredClasses = (color?: string) =>
		cn(baseClasses, "text-zinc-100 border", color ? `bg-[#${color}20]` : "");

	const getColoredStyles = (color?: string) => {
		if (!color) return {};
		return {
			backgroundColor: `#${color}20`,
			borderColor: `#${color}40`,
			color: `#${color}`,
		};
	};

	return (
		<div className={cn("flex flex-wrap gap-2", className)}>
			{visibleLabels.map((label) => (
				<span
					key={label.name}
					className={
						variant === "colored"
							? getColoredClasses(label.color)
							: getDefaultClasses()
					}
					style={
						variant === "colored" ? getColoredStyles(label.color) : undefined
					}
				>
					{label.name}
				</span>
			))}
			{remainingCount > 0 && (
				<span
					className={cn("text-zinc-500", {
						"text-xs": size === "sm",
						"text-sm": size === "md",
					})}
				>
					+{remainingCount} more
				</span>
			)}
		</div>
	);
}
