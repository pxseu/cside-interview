import { cn } from "@/utils/cn";
import type { routesQuery$data } from "../../utils/relay/__generated__/routesQuery.graphql";
import { Card } from "../ui/Card";
import { type Contributor, ContributorList } from "./ContributorList";
import { RepositoryStats } from "./RepositoryStats";

// Use generated types from GraphQL
export type Repository = NonNullable<routesQuery$data["repository"]>;

export interface RepositoryCardProps {
	repository: Repository;
	onViewIssues?: () => void;
	className?: string;
}

export function RepositoryCard({ repository, className }: RepositoryCardProps) {
	const commitCount = repository.defaultBranchRef?.target?.history?.totalCount;
	const branchCount = repository.refs?.totalCount;
	const contributors = repository.collaborators?.nodes || [];

	return (
		<Card className={cn("space-y-6", className)}>
			<div className="space-y-4">
				<div className="flex items-start justify-between">
					<div className="flex-1 min-w-0">
						<h2 className="text-xl font-bold text-zinc-100 truncate mb-2">
							{repository.name}
						</h2>
						{repository.description && (
							<p className="text-zinc-400 leading-relaxed">
								{repository.description}
							</p>
						)}
					</div>
				</div>

				<div className="p-4 bg-zinc-900/30 rounded-lg border border-zinc-800/30">
					<RepositoryStats
						stargazerCount={repository.stargazerCount}
						forkCount={repository.forkCount}
						branchCount={branchCount}
						commitCount={commitCount}
					/>
				</div>
			</div>

			{contributors.length > 0 && (
				<ContributorList
					contributors={contributors.filter(Boolean) as Contributor[]}
				/>
			)}
		</Card>
	);
}
