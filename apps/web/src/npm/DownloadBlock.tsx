import { Component, createResource, mergeProps } from "solid-js";
import { SimpleMetricBlock } from "../blocks";

type Props = {
  name?: string;
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
  props = mergeProps({ name: "solid-js", isPreview: false }, props);

  const [data, actions] = createPackageResource(props);

  return (
    <SimpleMetricBlock
      title="NPM Downloads"
      value={() => {
        return props.isPreview
          ? 1234
          : data().evaluation.popularity.downloadsCount;
      }}
      uow="downloads"
      {...data}
      {...actions}
    />
  );
};

export default NPMDownloadBlock;
