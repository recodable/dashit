import type { Component } from "solid-js";
import { mergeProps } from "solid-js";
import { SimpleMetricBlock } from "../blocks";
import type { Props } from "./types";
import { createGithubGraphqlResource } from "./fetcher";

type PullRequestData = {
  data: { repository: { pullRequests: { totalCount: number } } };
};

// TODO: implement caching for graphql query (not possible with fetch atm because graphql request are POST)
const GithubOpenPullRequestBlock: Component<Props> = (props) => {
  props = mergeProps({ user: "solidjs", repo: "solid" }, props);

  const [data, actions] = createGithubGraphqlResource<PullRequestData>(`
    {
      repository(
        owner: ${JSON.stringify(props.user)},
        name: ${JSON.stringify(props.repo)}
      ) {
        pullRequests(states: OPEN) {
          totalCount
        }
      }
    }
  `);

  return (
    <SimpleMetricBlock
      title="Github PR"
      value={() => data().data.repository.pullRequests.totalCount}
      uow="open PR"
      {...data}
      {...actions}
    />
  );
};

export default GithubOpenPullRequestBlock;
