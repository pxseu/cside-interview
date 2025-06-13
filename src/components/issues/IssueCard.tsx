import { cn } from "@/utils/cn";
import { MessageCircle } from "lucide-react";
import type { routesQuery$data } from "../../utils/relay/__generated__/routesQuery.graphql";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { DateDisplay } from "../ui/DateDisplay";
import { IssueLabels, type Label } from "./IssueLabels";

// Use generated types from GraphQL
export type Issue = NonNullable<
	NonNullable<
		NonNullable<routesQuery$data["repository"]>["issues"]["nodes"]
	>[number]
>;

export interface IssueCardProps {
	issue: Issue;
	onClick?: () => void;
	showBody?: boolean;
	className?: string;
}

export function IssueCard({
	issue,
	onClick,
	showBody = false,
	className,
}: IssueCardProps) {
	const labels = issue?.labels?.nodes || [];

	return (
		<Card
			className={cn(
				"space-y-4 transition-all duration-200",
				onClick &&
					"cursor-pointer hover:border-zinc-700/70 hover:shadow-lg hover:shadow-black/20",
				className,
			)}
			onClick={onClick}
		>
			<div className="flex items-start justify-between gap-4">
				<div className="flex-1 min-w-0 space-y-2">
					<div className="flex items-center gap-2">
						<span className="text-sm font-mono text-zinc-500">
							#{issue?.number}
						</span>
						<Badge variant={issue?.state === "OPEN" ? "success" : "error"}>
							{issue?.state}
						</Badge>
					</div>

					<h3 className="font-medium text-zinc-100 leading-tight">
						{issue?.title}
					</h3>
				</div>
			</div>

			{showBody && issue?.body && (
				<div className="prose prose-sm prose-zinc max-w-none">
					<p className="text-zinc-400 leading-relaxed">
						{issue.body.substring(0, 300)}
						{issue.body.length > 300 && "..."}
					</p>
				</div>
			)}

			<IssueLabels
				labels={labels as Label[]}
				maxDisplay={5}
				variant="colored"
			/>

			<div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
				<div className="flex items-center gap-4 text-sm text-zinc-500">
					{issue?.author && (
						<div className="flex items-center gap-2">
							<Avatar
								src={issue.author.avatarUrl}
								alt={issue.author.login || "Author"}
								fallback={issue.author.login?.[0]}
								size="sm"
							/>
							<span>{issue.author.login}</span>
						</div>
					)}

					{issue?.createdAt && <DateDisplay date={issue.createdAt} />}
				</div>

				{onClick && (
					<div className="text-zinc-600 group-hover:text-zinc-400 transition-colors">
						<MessageCircle className="w-4 h-4" />
					</div>
				)}
			</div>
		</Card>
	);
}
