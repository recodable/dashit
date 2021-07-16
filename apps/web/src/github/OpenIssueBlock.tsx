import type { Component } from "solid-js";
import { createResource, mergeProps } from "solid-js";
import { Show } from "solid-js/web";
import { SimpleMetricBlock } from "../blocks";
import type { Props } from "./types";
import { createGithubRESTResource } from "./fetcher";

const GithubOpenIssueBlock: Component<Props> = (props) => {
  props = mergeProps({ isPreview: false }, props);

  return (
    <>
      <Show when={props.isPreview}>
        <SimpleMetricBlock
          title="Github Issues"
          value={() => 123}
          uow="open issues"
          loading={false}
          refetch={() => null}
          badges={["your/repo"]}
        />
      </Show>

      <Show when={!props.isPreview}>
        <GithubOpenIssueBlockWithData
          settings={props.settings}
          period={props.period}
        />
      </Show>
    </>
  );
};

export default GithubOpenIssueBlock;

const GithubOpenIssueBlockWithData: Component<Props> = (props) => {
  const [data, actions] = createGithubRESTResource<{
    open_issues_count: number;
  }>(`repos/${props.settings.repository}`);

  return (
    <SimpleMetricBlock
      title="Github Issues"
      value={() => data().open_issues_count}
      uow="open issues"
      {...data}
      {...actions}
    />
  );
};
