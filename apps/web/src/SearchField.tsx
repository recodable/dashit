import type { Component } from "solid-js";
import { mergeProps, createRenderEffect } from "solid-js";
import { Show } from "solid-js/web";
import type { Store, SetStoreFunction } from "solid-js/store";
import { Loading, Search } from "./icons";

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      model: [any, (v: any) => any];
    }
  }
}

export type Model<T> = [Store<Partial<T>>, SetStoreFunction<Partial<T>>];

export function model<T>(el, value: () => Model<T>) {
  const [formData, setFormData] = value();
  createRenderEffect(() => (el.value = formData[el.name]));
  el.addEventListener("input", (e) =>
    setFormData({ [e.target.name]: e.target.value })
  );
}

type SearchableFormData = {
  search: string;
};

interface Props extends Partial<HTMLInputElement> {
  model: Model<SearchableFormData>;
  loading?: boolean;
}

const SearchField: Component<Props> = (props) => {
  props = mergeProps({ loading: false }, props);

  return (
    <div class="bg-gray-700 text-gray-500 px-6 py-2 rounded flex items-center gap-2">
      <Show when={!props.loading}>
        <Search class="w-4 h-4" />
      </Show>

      <Show when={props.loading}>
        <Loading class="w-4 h-4" />
      </Show>

      <input
        name="search"
        use:model={props.model}
        type="text"
        autocomplete="off"
        class="bg-gray-700 placeholder-gray-500 text-gray-100 outline-none"
        {...props}
      />
    </div>
  );
};

export default SearchField;
