import { createResource } from "solid-js";
import { useAuth0 } from "@rturnq/solid-auth0";

// export function createGithubRESTResource<T>(url: string, headers: object = {}) {
//   return createResource<T>(() => {
//     return fetch(`https://api.github.com/${url}`, {
//       headers: {
//         Authorization: `token ${import.meta.env.VITE_GITHUB_API_KEY}`,
//         ...headers,
//       },
//     }).then((response) => response.json());
//   });
// }

const sendGraphqlQuery = (query: string, token: string) => {
  return fetch(`${import.meta.env.VITE_API_URL}/github/graphql`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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
  const { getToken } = useAuth0();
  return createResource<R>(async () => {
    let data: R;
    const [query, options] = createQuery();
    const token = await getToken();

    do {
      const newData = await sendGraphqlQuery(
        query(
          options?.afterCursor
            ? { afterCursor: options?.afterCursor(data) }
            : {}
        ),
        token
      );

      data = options?.merge && !!data ? options.merge(data, newData) : newData;
    } while (options?.needNextPage ? options.needNextPage(data) : false);

    return data;
  });
}
