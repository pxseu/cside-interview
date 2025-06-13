import { MessageCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import { IssueCard, type Issue } from "./IssueCard";
import { Card } from "../ui/Card";

export interface IssueListProps {
	issues: Issue[];
	onIssueClick?: (issue: Issue) => void;
	emptyMessage?: string;
	showBody?: boolean;
	className?: string;
}

export function IssueList({
	issues,
	onIssueClick,
	emptyMessage = "No issues found.",
	showBody = false,
	className,
}: IssueListProps) {
	if (issues.length === 0) {
		return (
			<Card
				className={cn(
					"flex flex-col items-center justify-center py-16 px-8",
					className,
				)}
			>
				<MessageCircle className="w-12 h-12 text-zinc-600 mb-4" />
				<p className="text-zinc-500 text-center">{emptyMessage}</p>
			</Card>
		);
	}

	return (
		<div className={cn("space-y-4", className)}>
			{issues.map((issue) => (
				<IssueCard
					key={issue?.id}
					issue={issue}
					onClick={() => onIssueClick?.(issue)}
					showBody={showBody}
				/>
			))}
		</div>
	);
}
