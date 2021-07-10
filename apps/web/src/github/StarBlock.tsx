import type { Component } from "solid-js";
import { mergeProps } from "solid-js";
import { SimpleMetricBlock } from "../blocks";
import type { Props } from "./types";
import { createRepoStats } from "./fetcher";

const GithubStarBlock: Component<Props> = (props) => {
  props = mergeProps({ user: "solidjs", repo: "solid" }, props);

  const [data, actions] = createRepoStats(props);

  return (
    <SimpleMetricBlock
      title="Github Stars"
      value={() => data().stargazers_count}
      uow="stars"
      {...data}
      {...actions}
    />
  );
};

export default GithubStarBlock;
