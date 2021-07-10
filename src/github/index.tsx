// import type { Component } from "solid-js";
// import { createResource, mergeProps } from "solid-js";
// import { SimpleMetricBlock } from "../blocks";

// type Props = {
//   user: string;
//   repo: string;
// };

// type RepoParams = Props;

// export function createRepoStats({ user, repo }: RepoParams) {
//   return createResource<{
//     stargazers_count: number;
//     open_issues_count: number;
//   }>(() => {
//     const url = `https://api.github.com/repos/${user}/${repo}`;
//     return fetch(url).then((response) => response.json());
//   });
// }

// export function createGithubGraphqlResource<R>(query: string) {
//   return createResource<R>(() => {
//     return fetch("https://api.github.com/graphql", {
//       headers: {
//         Authorization: `Bearer ${import.meta.env.VITE_GITHUB_API_KEY}`,
//       },
//       body: JSON.stringify({ query }),
//       method: "POST",
//     }).then((response) => response.json());
//   });
// }

// export const GithubStarBlock: Component<Props> = (props) => {
//   props = mergeProps({ user: "solidjs", repo: "solid" }, props);

//   const [data] = createRepoStats(props);

//   return (
//     <SimpleMetricBlock
//       title="Github Stars"
//       value={() => data().stargazers_count}
//       uow="stars"
//       {...data}
//     />
//   );
// };

// export const GithubOpenIssueBlock: Component<Props> = (props) => {
//   props = mergeProps({ user: "solidjs", repo: "solid" }, props);

//   const [data] = createRepoStats(props);

//   return (
//     <SimpleMetricBlock
//       title="Github Issues"
//       value={() => data().open_issues_count}
//       uow="open issues"
//       {...data}
//     />
//   );
// };

// type PullRequestData = {
//   data: { repository: { pullRequests: { totalCount: number } } };
// };

// // TODO: implement caching for graphql query (not possible with fetch atm because graphql request are POST)
// export const GithubOpenPullRequestBlock = (props) => {
//   props = mergeProps({ user: "solidjs", repo: "solid" }, props);

//   const [data] = createGithubGraphqlResource<PullRequestData>(`
//     {
//       repository(
//         owner: ${JSON.stringify(props.user)},
//         name: ${JSON.stringify(props.repo)}
//       ) {
//         pullRequests(states: OPEN) {
//           totalCount
//         }
//       }
//     }
//   `);

//   return (
//     <SimpleMetricBlock
//       title="Github PR"
//       value={() => data().data.repository.pullRequests.totalCount}
//       uow="open PR"
//       {...data}
//     />
//   );
// };
