import type { Component } from "solid-js";
import { mergeProps } from "solid-js";
import { SimpleMetricBlock } from "../blocks";
import type { Props } from "./types";
import { createRepoStats } from "./fetcher";

const GithubOpenIssueBlock: Component<Props> = (props) => {
  props = mergeProps(
    { user: "solidjs", repo: "solid", isPreview: false },
    props
  );

  const [data, actions] = createRepoStats(props);

  return (
    <SimpleMetricBlock
      title="Github Issues"
      value={() => (props.isPreview ? 1234 : data().open_issues_count)}
      uow="open issues"
      {...data}
      {...actions}
    />
  );
};

export default GithubOpenIssueBlock;
