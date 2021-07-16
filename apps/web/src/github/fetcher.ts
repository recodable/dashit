import { parseWithOptions } from "date-fns/fp";
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

const sendGraphqlQuery = (query: string) => {
  return fetch("https://api.github.com/graphql", {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_GITHUB_API_KEY}`,
    },
    body: JSON.stringify({ query }),
    method: "POST",
  }).then((response) => response.json());
};

export function createGithubGraphqlResource<R>(
  createQuery: () => [
    query: (params?: object) => string,
    options?: {
      needNextPage?: (fetchedData: R) => boolean;
      afterCursor?: (fetchedData: R) => string;
      merge?: (newFetchedData: R | null, oldFetchedData: R) => R;
    }
  ]
) {
  return createResource<R>(async () => {
    let data: R;
    const [query, options] = createQuery();

    do {
      const newData = await sendGraphqlQuery(
        query(
          options?.afterCursor
            ? { afterCursor: options?.afterCursor(data) }
            : {}
        )
      );

      data = options?.merge && !!data ? options.merge(data, newData) : newData;
    } while (options?.needNextPage ? options.needNextPage(data) : false);

    return data;
  });
}
