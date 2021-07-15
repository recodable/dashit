import { createResource } from "solid-js";

export function createGithubRESTResource<T>(url: string, headers: object = {}) {
  return createResource<T>(() => {
    return fetch(`https://api.github.com/${url}`, {
      headers: {
        Authorization: `token ${import.meta.env.VITE_GITHUB_API_KEY}`,
        ...headers,
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
