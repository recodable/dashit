import type { Component } from "solid-js";
import { createResource, mergeProps } from "solid-js";
import { SimpleMetricBlock } from "../blocks";
import type { Props } from "./types";
import { createRepoStats } from "./fetcher";

const GithubOpenIssueBlock: Component<Props> = (props) => {
  props = mergeProps({ isPreview: false }, props);

  const [data, actions] = !props.isPreview
    ? createRepoStats(props.settings.repository)
    : createResource(() => ({ open_issues_count: 1234 }));

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

export default GithubOpenIssueBlock;
