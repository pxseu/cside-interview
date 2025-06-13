import { cn } from "@/utils/cn";
import { GitBranch, GitCommit, GitFork, Star } from "lucide-react";

export interface RepositoryStatsProps {
	stargazerCount: number;
	forkCount: number;
	branchCount?: number;
	commitCount?: number;
	className?: string;
}

export function RepositoryStats({
	stargazerCount,
	forkCount,
	branchCount,
	commitCount,
	className,
}: RepositoryStatsProps) {
	const stats = [
		{
			icon: Star,
			count: stargazerCount,
			label: "stars",
			color: "text-yellow-400",
		},
		{
			icon: GitFork,
			count: forkCount,
			label: "forks",
			color: "text-blue-400",
		},
		...(branchCount !== undefined
			? [
					{
						icon: GitBranch,
						count: branchCount,
						label: "branches",
						color: "text-green-400",
					},
				]
			: []),
		...(commitCount !== undefined
			? [
					{
						icon: GitCommit,
						count: commitCount,
						label: "commits",
						color: "text-purple-400",
					},
				]
			: []),
	];

	return (
		<div className={cn("flex flex-wrap gap-6", className)}>
			{stats.map((stat) => {
				const IconComponent = stat.icon;
				return (
					<div key={stat.label} className="flex items-center gap-2 text-sm">
						<IconComponent className={cn("w-4 h-4", stat.color)} />
						<span className="font-semibold text-zinc-200">
							{stat.count.toLocaleString()}
						</span>
						<span className="text-zinc-400">{stat.label}</span>
					</div>
				);
			})}
		</div>
	);
}
