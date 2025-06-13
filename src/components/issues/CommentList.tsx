import { cn } from "@/utils/cn";
import { MessageCircle, MoreHorizontal } from "lucide-react";
import type { IssueNumber_issue$data } from "../../utils/relay/__generated__/IssueNumber_issue.graphql";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { DateDisplay } from "../ui/DateDisplay";

// Use generated types from GraphQL
export type Comment = NonNullable<
	NonNullable<
		NonNullable<IssueNumber_issue$data["comments"]["edges"]>[number]
	>["node"]
>;

export interface CommentListProps {
	comments: Comment[];
	totalCount?: number;
	hasMore?: boolean;
	isLoading?: boolean;
	onLoadMore?: () => void;
	emptyMessage?: string;
	className?: string;
}

export function CommentList({
	comments,
	totalCount,
	hasMore = false,
	isLoading = false,
	onLoadMore,
	emptyMessage = "No comments yet.",
	className,
}: CommentListProps) {
	if (comments.length === 0) {
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
		<Card className={cn("space-y-6", className)}>
			<div className="flex items-center gap-3 pb-4 border-b border-zinc-800/50">
				<MessageCircle className="w-5 h-5 text-zinc-400" />
				<h3 className="text-lg font-medium text-zinc-200">Comments</h3>
				{totalCount !== undefined && (
					<span className="text-sm text-zinc-500">({totalCount})</span>
				)}
			</div>

			<div className="space-y-8">
				{comments.map((comment, index) => (
					<div
						key={comment?.id}
						className={cn(
							"relative",
							index !== comments.length - 1 &&
								"pb-8 after:absolute after:left-4 after:top-14 after:bottom-0 after:w-px after:bg-zinc-800/50",
						)}
					>
						<div className="flex gap-4">
							<div className="flex-shrink-0">
								<Avatar
									src={comment?.author?.avatarUrl}
									alt={comment.author?.login || "Commenter"}
									fallback={comment.author?.login?.[0]}
									size="md"
								/>
							</div>

							<div className="flex-1 min-w-0 space-y-3">
								<div className="flex items-center gap-2">
									<span className="font-medium text-zinc-300">
										{comment?.author?.login}
									</span>
									<span className="text-zinc-600">•</span>
									{comment?.createdAt && (
										<DateDisplay date={comment.createdAt} />
									)}
								</div>

								{comment?.body && (
									<div className="prose prose-sm prose-zinc max-w-none">
										<div className="p-4 bg-zinc-900/30 border border-zinc-800/30 rounded-lg">
											<p className="text-zinc-300 leading-relaxed whitespace-pre-wrap m-0">
												{comment.body}
											</p>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				))}

				{hasMore && onLoadMore && (
					<div className="flex justify-center pt-6 border-t border-zinc-800/30">
						<Button
							onClick={onLoadMore}
							disabled={isLoading}
							className="flex items-center gap-2"
						>
							{isLoading ? (
								<>
									<div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
									Loading...
								</>
							) : (
								<>
									<MoreHorizontal className="w-4 h-4" />
									Load More Comments
								</>
							)}
						</Button>
					</div>
				)}
			</div>
		</Card>
	);
}
