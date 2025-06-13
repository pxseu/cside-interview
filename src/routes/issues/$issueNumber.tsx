import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import {
	graphql,
	loadQuery,
	usePaginationFragment,
	usePreloadedQuery,
} from "react-relay";
import { z } from "zod";
import { type Comment, CommentList } from "../../components/issues/CommentList";
import { IssueLabels } from "../../components/issues/IssueLabels";
import type { Label } from "../../components/issues/IssueLabels";
import { PageHeader } from "../../components/layout/PageHeader";
import { Avatar } from "../../components/ui/Avatar";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { DateDisplay } from "../../components/ui/DateDisplay";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import type { IssueNumberQuery } from "../../utils/relay/__generated__/IssueNumberQuery.graphql";
import type { IssueNumber_issue$key } from "../../utils/relay/__generated__/IssueNumber_issue.graphql";

const ISSUE_QUERY = graphql`
  query IssueNumberQuery($owner: String!, $name: String!, $number: Int!) {
    repository(owner: $owner, name: $name) {
      name
      issue(number: $number) {
        id
        number
        title
        body
        createdAt
        state
        author {
          login
          avatarUrl
        }
        labels(first: 10) {
          nodes {
            name
            color
          }
        }
        ...IssueNumber_issue
      }
    }
  }
`;

const ISSUE_COMMENTS_FRAGMENT = graphql`
  fragment IssueNumber_issue on Issue
  @refetchable(queryName: "IssueNumberCommentsQuery")
  @argumentDefinitions(
    first: { type: "Int", defaultValue: 5 }
    after: { type: "String" }
  ) {
    comments(first: $first, after: $after)
      @connection(key: "IssueNumber_comments") {
      totalCount
      edges {
        node {
          id
          body
          createdAt
          author {
            login
            avatarUrl
          }
        }
      }
    }
  }
`;

const ISSUE_NUMBER_PARAMS = z.object({
	issueNumber: z.coerce.number().int().positive(),
});

const ISSUE_NUMBER_SEARCH = z.object({
	owner: z.string(),
	name: z.string(),
});

export const Route = createFileRoute("/issues/$issueNumber")({
	component: IssueDetailPage,
	pendingComponent: () => (
		<div className="flex items-center justify-center min-h-screen">
			<LoadingSpinner size="lg" />
		</div>
	),
	params: ISSUE_NUMBER_PARAMS,
	validateSearch: ISSUE_NUMBER_SEARCH,
	loader: async ({ context: { relayEnvironment }, params, location }) => {
		const searchParams = ISSUE_NUMBER_SEARCH.parse(location.search);

		return loadQuery<IssueNumberQuery>(
			relayEnvironment,
			ISSUE_QUERY,
			{
				owner: searchParams.owner,
				name: searchParams.name,
				number: params.issueNumber,
			},
			{ fetchPolicy: "store-and-network" },
		);
	},
});

function IssueDetailPage() {
	const preloadedQuery = Route.useLoaderData();
	const { issueNumber } = Route.useParams();
	const { owner, name } = Route.useSearch();
	const navigate = useNavigate();
	const data = usePreloadedQuery<IssueNumberQuery>(ISSUE_QUERY, preloadedQuery);

	const repository = data.repository;
	const issue = repository?.issue;

	const {
		data: commentsData,
		loadNext,
		isLoadingNext,
		hasNext,
	} = usePaginationFragment<IssueNumberQuery, IssueNumber_issue$key>(
		ISSUE_COMMENTS_FRAGMENT,
		issue,
	);

	const handleLoadMoreComments = () => {
		if (hasNext && !isLoadingNext) {
			loadNext(5);
		}
	};

	if (!repository || !issue) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				<Card className="text-center py-12 max-w-md">
					<div className="space-y-4">
						<h1 className="text-2xl font-bold text-zinc-100">
							Issue not found
						</h1>
						<p className="text-zinc-400">
							Issue #{issueNumber} in {owner}/{name} could not be found.
						</p>
						<Link
							to="/issues"
							search={{ owner, name, cursor: null, direction: "next" }}
							className="inline-flex items-center gap-2 text-zinc-300 hover:text-zinc-100 font-medium transition-colors"
						>
							<ChevronLeft className="w-4 h-4" />
							Back to issues
						</Link>
					</div>
				</Card>
			</div>
		);
	}

	const comments = commentsData?.comments;
	const commentEdges = comments?.edges || [];
	const totalComments = comments?.totalCount || 0;

	return (
		<div className="space-y-8">
			<PageHeader title={`#${issue.number} ${issue.title}`}>
				<Button
					onClick={() =>
						navigate({
							to: "/issues",
							search: { owner, name, cursor: null, direction: "next" },
						})
					}
					className="flex items-center gap-2"
				>
					<ChevronLeft className="w-4 h-4" />
					Back to issues
				</Button>
			</PageHeader>

			<Card>
				<div className="space-y-6">
					<div className="flex items-start gap-4">
						{issue.author?.avatarUrl && (
							<Avatar
								src={issue.author.avatarUrl}
								alt={issue.author.login || "Author"}
								size="md"
							/>
						)}
						<div className="flex-1">
							<div className="flex items-center justify-between mb-2">
								<div className="flex items-center gap-2">
									<span className="font-medium text-zinc-200">
										{issue.author?.login}
									</span>
									<span className="text-zinc-500">•</span>
									<DateDisplay
										date={issue.createdAt}
										className="text-sm text-zinc-500"
									/>
								</div>
								<Badge variant={issue.state === "OPEN" ? "success" : "error"}>
									{issue.state === "OPEN" ? "OPEN" : "CLOSED"}
								</Badge>
							</div>

							{issue.labels?.nodes && (
								<IssueLabels
									labels={issue.labels.nodes as Label[]}
									variant="colored"
									size="sm"
								/>
							)}
						</div>
					</div>

					{issue.body && (
						<div className="prose prose-zinc max-w-none">
							<div className="p-4 bg-zinc-900/30 border border-zinc-800/30 rounded-lg">
								<div className="whitespace-pre-wrap text-zinc-300 leading-relaxed">
									{issue.body}
								</div>
							</div>
						</div>
					)}
				</div>
			</Card>

			{totalComments > 0 && (
				<CommentList
					comments={
						commentEdges.map((edge) => edge?.node).filter(Boolean) as Comment[]
					}
					totalCount={totalComments}
					hasMore={hasNext}
					isLoading={isLoadingNext}
					onLoadMore={handleLoadMoreComments}
				/>
			)}
		</div>
	);
}
