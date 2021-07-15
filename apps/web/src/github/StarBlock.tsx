import type { Component } from "solid-js";
import { mergeProps } from "solid-js";
import { Show } from "solid-js/web";
import { SimpleMetricBlock } from "../blocks";
import type { Props } from "./types";
import { createGithubGraphqlResource } from "./fetcher";
import { isAfter, sub } from "date-fns";

const GithubStarBlock: Component<Props> = (props) => {
  props = mergeProps({ isPreview: false }, props);

  return (
    <>
      <Show when={props.isPreview}>
        <SimpleMetricBlock
          title="Github Stars"
          value={() => 1234}
          uow="stars"
          badges={["your/repo"]}
          loading={false}
          refetch={() => null}
        />
      </Show>

      <Show when={!props.isPreview}>
        <GithubStarBlockWithData
          settings={props.settings}
          period={props.period}
        />
      </Show>
    </>
  );
};

export default GithubStarBlock;

const GithubStarBlockWithData = (props) => {
  const [owner, name] = props.settings.repository.full_name.split("/");

  const [data, actions] = createGithubGraphqlResource<{
    data: {
      repository: {
        stargazers: {
          edges: { cursor: string; starredAt: string }[];
          totalCount: number;
        };
      };
    };
  }>(`
    {
      repository(owner: ${JSON.stringify(owner)}, name: ${JSON.stringify(
    name
  )}) {
        stargazers(orderBy: {field: STARRED_AT, direction: DESC}, first: 100) {
          edges {
            cursor
            starredAt
          }
          totalCount
        }
      }
    }
  `);

  return (
    <SimpleMetricBlock
      title="Github Stars"
      value={() => {
        if (!isFinite(props.period)) {
          return data().data.repository.stargazers.totalCount;
        }

        return data().data.repository.stargazers.edges.filter(
          ({ starredAt }) => {
            return isAfter(
              new Date(starredAt),
              sub(new Date(), { days: props.period })
            );
          }
        ).length;
      }}
      uow="stars"
      badges={[props.settings.repository.full_name]}
      {...data}
      {...actions}
    />
  );
};
