import type { Component } from "solid-js";
import { mergeProps } from "solid-js";
import { SimpleMetricBlock } from "../blocks";
import type { Props } from "./types";
import { createRepoStats } from "./fetcher";

const GithubOpenIssueBlock: Component<Props> = (props) => {
  props = mergeProps({ user: "solidjs", repo: "solid" }, props);

  const [data] = createRepoStats(props);

  return (
    <SimpleMetricBlock
      title="Github Issues"
      value={() => data().open_issues_count}
      uow="open issues"
      {...data}
    />
  );
};

export default GithubOpenIssueBlock;
