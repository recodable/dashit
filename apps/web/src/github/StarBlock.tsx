import type { Component } from "solid-js";
import { mergeProps } from "solid-js";
import { Show } from "solid-js/web";
import { SimpleMetricBlock } from "../blocks";
import type { Props } from "./types";
import { createGithubGraphqlResource } from "./fetcher";
import { isAfter, isBefore, sub } from "date-fns";

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
  }>(() => {
    return [
      ({ afterCursor = null }: { afterCursor?: string }) => `
        {
          repository(
            owner: ${JSON.stringify(owner)},
            name: ${JSON.stringify(name)}
          ) {
            stargazers(
              ${afterCursor ? `after: "${afterCursor}",` : ""}
              orderBy: {field: STARRED_AT, direction: DESC},
              first: 100
            ) {
              edges {
                cursor
                starredAt
              }
              totalCount
            }
          }
        }
      `,
      {
        afterCursor: (data) => {
          if (!data) return null;
          const { edges } = data.data.repository.stargazers;
          return edges[edges.length - 1].cursor;
        },

        needNextPage: (data) => {
          const { edges } = data.data.repository.stargazers;

          return (
            data.data.repository.stargazers.totalCount !==
              data.data.repository.stargazers.edges.length &&
            isAfter(
              new Date(edges[edges.length - 1].starredAt),
              sub(new Date(), { days: props.period * 2 })
            )
          );
        },

        merge: (oldData, newData) => {
          newData.data.repository.stargazers.edges = [
            ...oldData.data.repository.stargazers.edges,
            ...newData.data.repository.stargazers.edges,
          ];

          return newData;
        },
      },
    ];
  });

  const value = () => {
    if (!isFinite(props.period)) {
      return data().data.repository.stargazers.totalCount;
    }

    return data().data.repository.stargazers.edges.filter(({ starredAt }) => {
      return isAfter(
        new Date(starredAt),
        sub(new Date(), { days: props.period })
      );
    }).length;
  };

  const previousValue = () => {
    return data().data.repository.stargazers.edges.filter(({ starredAt }) => {
      return (
        isAfter(
          new Date(starredAt),
          sub(new Date(), { days: props.period * 2 })
        ) &&
        isBefore(new Date(starredAt), sub(new Date(), { days: props.period }))
      );
    }).length;
  };

  return (
    <SimpleMetricBlock
      title="Github Stars"
      value={value}
      uow="stars"
      badges={[props.settings.repository.full_name]}
      trend={
        isFinite(props.period)
          ? {
              value: () => {
                const result = Math.round(
                  ((value() - previousValue()) * 100) / previousValue()
                );

                return !isNaN(result) ? result : 0;
              },
              uow: "%",
            }
          : null
      }
      {...data}
      {...actions}
    />
  );
};
