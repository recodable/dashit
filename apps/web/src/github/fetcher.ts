import { createResource } from "solid-js";
import type { Repo } from "./types";

export function createRepoStats({ full_name }: Repo) {
  return createResource<{
    stargazers_count: number;
    open_issues_count: number;
  }>(() => {
    const url = `https://api.github.com/repos/${full_name}`;
    return fetch(url, {
      headers: {
        Authorization: `token ${import.meta.env.VITE_GITHUB_API_KEY}`,
      },
    }).then((response) => response.json());
  });
}

export function createGithubGraphqlResource<R>(query: string) {
  return createResource<R>(() => {
    return fetch("https://api.github.com/graphql", {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_GITHUB_API_KEY}`,
      },
      body: JSON.stringify({ query }),
      method: "POST",
    }).then((response) => response.json());
  });
}
