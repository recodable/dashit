export type Repo = { id: number; full_name: string };

export type Props = {
  settings: {
    repository: Repo;
  };
  isPreview?: boolean;
};
