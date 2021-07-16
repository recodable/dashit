import { Component, createResource, mergeProps } from "solid-js";
import { SimpleMetricBlock } from "../blocks";
import { Show } from "solid-js/web";

type Props = {
  name: string;
  isPreview?: boolean;
};

type PackageParams = Props;

export function createPackageResource({ name }: PackageParams) {
  return createResource<{
    evaluation: { popularity: { downloadsCount: number } };
  }>(() => {
    const url = `https://api.npms.io/v2/package/${name}`;
    return fetch(url).then((response) => response.json());
  });
}

export const NPMDownloadBlock: Component<Props> = (props) => {
  props = mergeProps({ isPreview: false }, props);

  return (
    <>
      <Show when={props.isPreview}>
        <SimpleMetricBlock
          title="NPM Downloads"
          value={() => 1234}
          uow="downloads"
        />
      </Show>
      <Show when={!props.isPreview}>
        <NPMDownloadBlockWithData name={props.name} />
      </Show>
    </>
  );
};

export default NPMDownloadBlock;

export const NPMDownloadBlockWithData: Component<Props> = (props) => {
  const [data, actions] = createPackageResource(props);

  return (
    <SimpleMetricBlock
      title="NPM Downloads"
      value={() => data().evaluation.popularity.downloadsCount}
      uow="downloads"
      {...data}
      {...actions}
    />
  );
};
