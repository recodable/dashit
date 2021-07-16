import type { Component } from "solid-js";
import { createRenderEffect, mergeProps, on } from "solid-js";
import { Show } from "solid-js/web";
import { SimpleMetricBlock } from "../blocks";
import type { Props } from "./types";
import { createGithubGraphqlResource } from "./fetcher";
import { sub } from "date-fns";

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
  const [owner, name] = props.settings.repository.full_name.split("/");

  const [data, actions] = createGithubGraphqlResource<{
    data: { repository: { issues: { totalCount: number } } };
  }>(() => [
    () => `{
      repository(
        owner: ${JSON.stringify(owner)},
        name: ${JSON.stringify(name)}
      ) {
        issues(filterBy: { since: ${JSON.stringify(
          sub(new Date(), { days: props.period })
        )}, states: [OPEN] }, first: 100) {
          totalCount
        }
      }
    }`,
  ]);

  const [prevData, prevActions] = createGithubGraphqlResource<{
    data: { repository: { issues: { totalCount: number } } };
  }>(() => [
    () => `{
      repository(
        owner: ${JSON.stringify(owner)},
        name: ${JSON.stringify(name)}
      ) {
        issues(filterBy: { since: ${JSON.stringify(
          sub(new Date(), { days: props.period * 2 })
        )}, states: [OPEN] }, first: 100) {
          totalCount
        }
      }
    }`,
  ]);

  const refetch = () => {
    actions.refetch();
    prevActions.refetch();
  };

  createRenderEffect(on(() => props.period, refetch));

  return (
    <SimpleMetricBlock
      title="Github Issues"
      value={() => data().data.repository.issues.totalCount}
      trend={{
        value: () =>
          prevData().data.repository.issues.totalCount -
          data().data.repository.issues.totalCount,
        uow: "%",
      }}
      uow="open issues"
      badges={[props.settings.repository.full_name]}
      loading={data.loading || prevData.loading}
      refetch={refetch}
    />
  );
};
