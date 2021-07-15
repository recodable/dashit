import type { Component } from "solid-js";
import { createResource, mergeProps } from "solid-js";
import { SimpleMetricBlock } from "../blocks";
import type { Props } from "./types";
import { createRepoStats } from "./fetcher";

const GithubStarBlock: Component<Props> = (props) => {
  props = mergeProps({ isPreview: false }, props);

  const [data, actions] = !props.isPreview
    ? createRepoStats(props.settings.repository)
    : createResource(() => ({ stargazers_count: 1234 }));

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
