import type { Component } from "solid-js";
import { createResource, mergeProps } from "solid-js";
import { SimpleMetricBlock } from "../blocks";
import type { Props } from "./types";
import { createGithubGraphqlResource } from "./fetcher";

type PullRequestData = {
  data: { repository: { pullRequests: { totalCount: number } } };
};

// TODO: implement caching for graphql query (not possible with fetch atm because graphql request are POST)
const GithubOpenPullRequestBlock: Component<Props> = (props) => {
  props = mergeProps({ repo: { full_name: "" }, isPreview: false }, props);

  const [userName, repoName] = !props.isPreview
    ? props.settings.repository.full_name.split("/")
    : ["solidjs", "solid"];

  const [data, actions] = !props.isPreview
    ? createGithubGraphqlResource<PullRequestData>(`
    {
      repository(
        owner: ${JSON.stringify(userName)},
        name: ${JSON.stringify(repoName)}
      ) {
        pullRequests(states: OPEN) {
          totalCount
        }
      }
    }
  `)
    : createResource(() => ({
        data: { repository: { pullRequests: { totalCount: 1234 } } },
      }));

  return (
    <SimpleMetricBlock
      title="Github PR"
      value={() =>
        props.isPreview ? 1234 : data().data.repository.pullRequests.totalCount
      }
      uow="open PR"
      {...data}
      {...actions}
    />
  );
};

export default GithubOpenPullRequestBlock;
