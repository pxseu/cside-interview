import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { graphql, loadQuery, usePreloadedQuery } from "react-relay";
import { z } from "zod";
import type { Issue } from "../../components/issues/IssueCard";
import { IssueList } from "../../components/issues/IssueList";
import { PageHeader } from "../../components/layout/PageHeader";
import { CursorPagination } from "../../components/CursorPagination";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import type { issuesQuery } from "../../utils/relay/__generated__/issuesQuery.graphql";

const ISSUES_QUERY = graphql`
  query issuesQuery(
    $owner: String!
    $name: String!
    $first: Int
    $last: Int
    $after: String
    $before: String
  ) {
    repository(owner: $owner, name: $name) {
      name
      issues(
        first: $first
        last: $last
        after: $after
        before: $before
        states: [OPEN]
        orderBy: { field: CREATED_AT, direction: DESC }
      ) {
        totalCount
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        nodes {
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
        }
      }
    }
  }
`;

const ISSUES_SEARCH = z.object({
  owner: z.string(),
  name: z.string(),
  cursor: z.string().nullable(),
  direction: z.enum(["next", "prev"]),
});

export const Route = createFileRoute("/issues/")({
  component: IssuesPage,
  pendingComponent: () => (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="lg" />
    </div>
  ),
  validateSearch: ISSUES_SEARCH,
  loader: async ({ context: { relayEnvironment }, location }) => {
    const searchParams = ISSUES_SEARCH.parse(location.search);

    const isPrevious = searchParams.direction === "prev";
    const variables = {
      owner: searchParams.owner,
      name: searchParams.name,
      ...(isPrevious
        ? {
            last: 10,
            before: searchParams?.cursor || null,
          }
        : {
            first: 10,
            after: searchParams?.cursor || null,
          }),
    };

    return loadQuery<issuesQuery>(relayEnvironment, ISSUES_QUERY, variables, {
      fetchPolicy: "store-and-network",
    });
  },
});

function IssuesPage() {
  const preloadedQuery = Route.useLoaderData();
  const { owner, name } = Route.useSearch();
  const navigate = useNavigate();
  const data = usePreloadedQuery<issuesQuery>(ISSUES_QUERY, preloadedQuery);

  const repository = data.repository;
  const issues = repository?.issues;

  if (!repository) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="text-center py-12 max-w-md">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-zinc-100">
              Repository not found
            </h1>
            <p className="text-zinc-400">
              The repository {owner}/{name} could not be found.
            </p>
            <Link
              to="/"
              search={{ owner, name }}
              className="inline-flex items-center gap-2 text-zinc-300 hover:text-zinc-100 font-medium transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to search
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const issueNodes = issues?.nodes || [];

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Issues for ${repository.name}`}
        description={`${issues?.totalCount || 0} open issues`}
      >
        <Button
          onClick={() => navigate({ to: "/", search: { owner, name } })}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to repository
        </Button>
      </PageHeader>

      <IssueList
        issues={issueNodes as Issue[]}
        onIssueClick={(issue: Issue) =>
          navigate({
            to: "/issues/$issueNumber",
            params: { issueNumber: issue?.number ?? 0 },
            search: { owner, name },
          })
        }
        showBody={true}
      />

      <CursorPagination
        hasNextPage={issues?.pageInfo?.hasNextPage ?? false}
        hasPreviousPage={issues?.pageInfo?.hasPreviousPage ?? false}
        onNext={() =>
          navigate({
            to: "/issues",
            search: {
              owner,
              name,
              cursor: issues?.pageInfo?.endCursor || null,
              direction: "next",
            },
          })
        }
        onPrevious={() =>
          navigate({
            to: "/issues",
            search: {
              owner,
              name,
              cursor: issues?.pageInfo?.startCursor || null,
              direction: "prev",
            },
          })
        }
        currentCount={issueNodes.length}
        totalCount={issues?.totalCount || 0}
        itemName="issues"
        pageSize={10}
      />
    </div>
  );
}
