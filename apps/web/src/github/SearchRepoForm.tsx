import type { Component } from "solid-js";
import { createSignal, createResource } from "solid-js";
import { createStore } from "solid-js/store";
import { For, Show } from "solid-js/web";
import SearchField from "../SearchField";

const SearchRepoForm: Component<{
  onSubmit: () => void;
  onCancel: () => void;
}> = (props) => {
  type Repo = { id: number; full_name: string };

  const [formData, setFormData] = createStore<{
    search: string;
    selectedRepo: Repo;
  }>({
    search: "",
    selectedRepo: null,
  });

  // TODO: add debounce
  const searchRepo = (search) => {
    if (search.length < 2) return Promise.resolve(null);

    return fetch(`https://api.github.com/search/repositories?q=${search}`).then(
      (response) => response.json()
    );
  };

  const [repositories] = createResource<{ items: Repo[] }, string>(
    () => formData.search,
    searchRepo
  );

  const resultRepositories: () => Repo[] = () =>
    repositories()
      .items.filter((repository) => repository.id !== selectedRepo()?.id)
      .slice(0, 5);

  const [selectedRepo, setSelectedRepo] = createSignal<Repo>(null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit();
      }}
      class="flex flex-col gap-6 mt-6"
    >
      <div>
        <SearchField
          model={[formData, setFormData]}
          placeholder="Search Repository"
          loading={repositories.loading}
          autofocus
        />
      </div>

      <div
        class="flex flex-col justify-center items-center gap-6"
        style="min-height: 120px;"
      >
        <Show when={!repositories()}>
          <div class="flex gap-2 items-baseline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7l4-4m0 0l4 4m-4-4v18"
              />
            </svg>

            <span class="font-mono">Find your repository by name</span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7l4-4m0 0l4 4m-4-4v18"
              />
            </svg>
          </div>
        </Show>

        <Show when={selectedRepo()}>
          <ul class="flex flex-col gap-2 w-full bg-gray-800 py-2 px-4 rounded-lg">
            <li>
              <button
                onClick={() => setSelectedRepo(null)}
                type="button"
                class="cursor-pointer flex gap-3 items-center w-full"
              >
                <span class="w-5 h-5 rounded-md bg-red-700 text-white flex justify-center items-center">
                  <Minus class="w-3 h-3" />
                </span>

                <span>{selectedRepo().full_name}</span>
              </button>
            </li>
          </ul>
        </Show>

        <Show when={repositories()?.items.length > 0}>
          <ul class="flex flex-col gap-2 w-full bg-gray-800 py-2 px-4 rounded-lg">
            <For each={resultRepositories()}>
              {(repository, index) => (
                <>
                  <li>
                    <button
                      onClick={() => setSelectedRepo(repository)}
                      type="button"
                      class="cursor-pointer flex gap-3 items-center w-full"
                    >
                      <span class="w-5 h-5 rounded-md bg-green-700 text-white flex justify-center items-center">
                        <Plus class="w-3 h-3" />
                      </span>
                      <span>{repository.full_name}</span>
                    </button>
                  </li>

                  <Show when={index() < resultRepositories().length - 1}>
                    <hr class="border-gray-700" />
                  </Show>
                </>
              )}
            </For>
          </ul>
        </Show>
      </div>

      <div class="flex gap-4">
        <button
          type="submit"
          class="py-4 px-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 font-semibold"
        >
          Add Block
        </button>

        <button
          type="button"
          class="py-4 px-6 font-semibold bg-gray-600 hover:bg-gray-500"
          onClick={props.onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default SearchRepoForm;
