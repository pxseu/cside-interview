import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { graphql, loadQuery, usePreloadedQuery } from "react-relay";
import { z } from "zod";
import { SearchForm } from "../components/SearchForm";
import { type Issue, IssueCard } from "../components/issues/IssueCard";
import { PageHeader } from "../components/layout/PageHeader";
import {
  type Repository,
  RepositoryCard,
} from "../components/repository/RepositoryCard";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import type { routesQuery } from "../utils/relay/__generated__/routesQuery.graphql";

const INDEX_QUERY = graphql`
  query routesQuery($owner: String!, $name: String!, $includeRepo: Boolean!) {
    viewer {
      name
    }
    repository(owner: $owner, name: $name) @include(if: $includeRepo) {
      name
      description
      stargazerCount
      forkCount
      defaultBranchRef {
        target {
          ... on Commit {
            history {
              totalCount
            }
          }
        }
      }
      refs(refPrefix: "refs/heads/", first: 100) {
        totalCount
      }
      collaborators(first: 10) {
        nodes {
          login
          name
          avatarUrl
        }
      }
      issues(
        first: 5
        states: [OPEN]
        orderBy: { field: CREATED_AT, direction: DESC }
      ) {
        totalCount
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

const INDEX_SEARCH = z.object({
  owner: z.string().default("oven-sh"),
  name: z.string().default("bun"),
});

export const Route = createFileRoute("/")({
  component: App,
  pendingComponent: () => (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="lg" />
    </div>
  ),
  validateSearch: INDEX_SEARCH,
  loader: async ({ context: { relayEnvironment }, location }) => {
    const searchParams = INDEX_SEARCH.parse(location.search);

    return loadQuery<routesQuery>(
      relayEnvironment,
      INDEX_QUERY,
      {
        owner: searchParams.owner,
        name: searchParams.name,
        includeRepo: true,
      },
      { fetchPolicy: "store-and-network" },
    );
  },
});

function App() {
  const preloadedQuery = Route.useLoaderData();
  const { owner, name } = Route.useSearch();
  const navigate = useNavigate();
  const data = usePreloadedQuery<routesQuery>(INDEX_QUERY, preloadedQuery);

  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = async (searchOwner: string, searchName: string) => {
    setIsSearching(true);
    setSearchError(null);

    try {
      await navigate({
        to: "/",
        search: { owner: searchOwner, name: searchName },
      });
    } catch (error) {
      console.error("Search failed:", error);
      setSearchError("Failed to search repository. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const repository = data.repository;

  return (
    <div className="space-y-8">
      <PageHeader
        title="GitHub Repository Explorer"
        description={`Hello, ${data.viewer.name}! Search and explore GitHub repositories.`}
      />

      <SearchForm
        onSearch={handleSearch}
        initialValue={`${owner}/${name}`}
        isLoading={isSearching}
        error={searchError || undefined}
      />

      {!repository ? (
        <Card className="text-center py-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-zinc-100">
              Repository not found
            </h2>
            <p className="text-zinc-400 max-w-md mx-auto">
              The repository{" "}
              <span className="font-mono text-zinc-300">
                {owner}/{name}
              </span>{" "}
              could not be found. It might be private, renamed, or deleted.
            </p>
            <Button
              onClick={() => {
                navigate({
                  to: "/",
                  search: { owner: "oven-sh", name: "bun" },
                  replace: true,
                });
              }}
              className="mt-4"
            >
              Try a different repository
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-8">
          <RepositoryCard repository={repository as Repository} />

          {repository?.issues?.nodes && repository.issues.nodes.length > 0 && (
            <Card>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-zinc-100">
                    Recent Issues
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-zinc-400">
                      {repository.issues.totalCount} total
                    </span>
                    <Button
                      onClick={() =>
                        navigate({
                          to: "/issues",
                          search: {
                            owner,
                            name,
                            cursor: null,
                            direction: "next",
                          },
                        })
                      }
                      className="text-sm"
                    >
                      View All →
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {repository.issues.nodes.map((issue) => (
                    <IssueCard
                      key={issue?.id}
                      issue={issue as Issue}
                      onClick={() =>
                        navigate({
                          to: "/issues/$issueNumber",
                          params: {
                            issueNumber: issue?.number ?? 1,
                          },
                          search: { owner, name },
                        })
                      }
                      showBody={true}
                    />
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
