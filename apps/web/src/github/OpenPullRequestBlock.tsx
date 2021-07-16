import type { Component } from "solid-js";
import { createResource, mergeProps } from "solid-js";
import { Show } from "solid-js/web";
import { SimpleMetricBlock } from "../blocks";
import type { Props } from "./types";
import { createGithubGraphqlResource } from "./fetcher";

type PullRequestData = {
  data: { repository: { pullRequests: { totalCount: number } } };
};

const GithubOpenPullRequestBlock: Component<Props> = (props) => {
  props = mergeProps({ isPreview: false }, props);

  return (
    <>
      <Show when={props.isPreview}>
        <SimpleMetricBlock title="Github PR" value={() => 1234} uow="open PR" />
      </Show>

      <Show when={!props.isPreview}>
        <GithubOpenPullRequestBlockWithData
          period={props.period}
          settings={props.settings}
        />
      </Show>
    </>
  );
};

export default GithubOpenPullRequestBlock;

const GithubOpenPullRequestBlockWithData: Component<Props> = (props) => {
  const [userName, repoName] = props.settings.repository.full_name.split("/");

  const [data, actions] = createGithubGraphqlResource<PullRequestData>(() => [
    () => `
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
    `,
  ]);

  return (
    <SimpleMetricBlock
      title="Github PR"
      value={() => data().data.repository.pullRequests.totalCount}
      uow="open PR"
      badges={[props.settings.repository.full_name]}
      {...data}
      {...actions}
    />
  );
};
