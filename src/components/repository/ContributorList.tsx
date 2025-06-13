import { cn } from "@/utils/cn";
import { Users } from "lucide-react";
import type { routesQuery$data } from "../../utils/relay/__generated__/routesQuery.graphql";
import { Avatar } from "../ui/Avatar";

// Use generated types from GraphQL
export type Contributor = NonNullable<
	NonNullable<
		NonNullable<routesQuery$data["repository"]>["collaborators"]
	>["nodes"]
>[number];

export interface ContributorListProps {
	contributors: Contributor[];
	title?: string;
	className?: string;
}

export function ContributorList({
	contributors,
	title = "Contributors",
	className,
}: ContributorListProps) {
	if (!contributors || contributors.length === 0) {
		return null;
	}

	return (
		<div className={cn("space-y-4", className)}>
			<div className="flex items-center gap-2">
				<Users className="w-4 h-4 text-zinc-400" />
				<h3 className="text-sm font-medium text-zinc-300">
					{title} ({contributors.length})
				</h3>
			</div>

			<div className="flex flex-wrap gap-3">
				{contributors.slice(0, 8).map((contributor) => (
					<div
						key={contributor?.login}
						className={cn(
							"flex items-center gap-3 p-3 rounded-lg border border-zinc-800/50",
							"bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors",
							"group",
						)}
					>
						<Avatar
							src={contributor?.avatarUrl}
							alt={contributor?.name || contributor?.login || "Contributor"}
							fallback={contributor?.name?.[0] || contributor?.login?.[0]}
							size="sm"
						/>
						<div className="min-w-0 flex-1">
							<div className="text-sm font-medium text-zinc-200 truncate">
								{contributor?.name || contributor?.login}
							</div>
							{contributor?.login && contributor?.name && (
								<div className="text-xs text-zinc-500 truncate">
									@{contributor?.login}
								</div>
							)}
						</div>
					</div>
				))}

				{contributors.length > 8 && (
					<div className="flex items-center gap-2 p-3 rounded-lg border border-zinc-800/50 bg-zinc-900/30 text-zinc-400">
						<span className="text-sm">+{contributors.length - 8} more</span>
					</div>
				)}
			</div>
		</div>
	);
}
