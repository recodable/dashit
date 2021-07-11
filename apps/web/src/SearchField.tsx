import type { Component } from "solid-js";
import type { Store, SetStoreFunction } from "solid-js/store";
import { createRenderEffect, mergeProps } from "solid-js";
import { Show } from "solid-js/web";
import Loading from "./Loading";

type SearchableFormData = {
  search: string;
};

type Model = [
  Store<Partial<SearchableFormData>>,
  SetStoreFunction<Partial<SearchableFormData>>
];

interface Props extends Partial<HTMLInputElement> {
  model: Model;
  loading?: boolean;
}

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      model: [any, (v: any) => any];
    }
  }
}

export function model(el, value: () => Model) {
  const [formData, setFormData] = value();
  createRenderEffect(() => (el.value = formData[el.name]));
  el.addEventListener("input", (e) =>
    setFormData({ [e.target.name]: e.target.value })
  );
}

const SearchField: Component<Props> = (props) => {
  props = mergeProps({ loading: false }, props);

  return (
    <div class="bg-gray-700 text-gray-500 px-6 py-2 rounded flex items-center gap-2">
      <Show when={!props.loading}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </Show>

      <Show when={props.loading}>
        <Loading class="w-4 h-4" />
      </Show>

      <input
        name="search"
        use:model={props.model}
        type="text"
        class="bg-gray-700 placeholder-gray-500 text-gray-100 outline-none"
        {...props}
      />
    </div>
  );
};

export default SearchField;
