import type { Component } from "solid-js";
import {
  createSignal,
  lazy,
  onCleanup,
  mergeProps,
  createResource,
} from "solid-js";
import { createStore } from "solid-js/store";
import {
  For,
  Dynamic,
  Show,
  Index,
  Switch,
  Match,
  ErrorBoundary,
} from "solid-js/web";
import { TransitionGroup } from "solid-transition-group";
import { setModal } from "@guillotin/solid";
import hotkeys from "hotkeys-js";
import SearchField from "../SearchField";
// import debounce from "lodash.debounce";
import { Link } from "solid-app-router";
import { ChevronLeft, PlusCircle, Minus, Plus } from "../icons";

type Block = {
  name: string;
  description: string;
  Component: Component;
};

const [blocks, setBlocks] = createSignal<Block[]>([
  {
    name: "Github Star",
    description:
      "See all your Github stars evolution over time on one repository",
    Component: lazy(() => import("../github/StarBlock")),
  },
  {
    name: "Github Issue",
    description:
      "See how  many issues are open at the moment on one repository",
    Component: lazy(() => import("../github/OpenIssueBlock")),
  },
  {
    name: "Github PR",
    description: "See how  many PR are open at the moment on one reposirory",
    Component: lazy(() => import("../github/OpenPullRequestBlock")),
  },
  // NPMDownloadBlock,
]);

const CreateBlock: Component = () => {
  const [formData, setFormData] = createStore({ search: "" });

  return (
    <div class="p-16 flex flex-col justify-center items-center">
      <div style="width: 768px;">
        <div class="my-12">
          <Link href="/" class="clickable-text mb-2">
            <ChevronLeft class="w-4 h-4" />
            <span>Back to dashboard</span>
          </Link>

          <div class="flex justify-between">
            <h1 class="text-4xl font-extrabold">Add Block</h1>

            <SearchField
              model={[formData, setFormData]}
              placeholder="Search Blocks"
            />
          </div>
        </div>

        <ul class="grid grid-cols-3 gap-4">
          <TransitionGroup
            enterActiveClass="transition ease-in-out duration-100"
            enterClass="opacity-0"
            enterToClass="opacity-100"
            exitActiveClass="transition ease-in-out duration-100"
            exitClass="opacity-100"
            exitToClass="opacity-0"
          >
            <For
              each={blocks().filter(({ name }) => {
                return name
                  .toLowerCase()
                  .includes(formData.search.toLowerCase());
              })}
            >
              {(block) => {
                const [hovered, setHovered] = createSignal(false);

                return (
                  <li
                    onClick={() =>
                      setModal({ Component: NewBlockModal, data: { block } })
                    }
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    class="small-card"
                  >
                    <Show when={hovered()}>
                      <div class="absolute inset-0 bg-purple-800 opacity-70 flex justify-center items-center text-purple-200">
                        <PlusCircle class="w-7 h-7" />
                      </div>
                    </Show>

                    <Dynamic component={block.Component} />
                  </li>
                );
              }}
            </For>
          </TransitionGroup>
        </ul>
      </div>
    </div>
  );
};

export default CreateBlock;

const NewBlockModal: Component<{ block: Block; handleClose: () => void }> = (
  props
) => {
  props = mergeProps({ block: blocks()[1] }, props);

  const [stepIndex, setStepIndex] = createSignal(0);

  return (
    <div
      class="relative rounded-lg bg-gray-900 p-10 text-white"
      style="width: 480px;"
    >
      <Switch>
        <Match when={stepIndex() === 0}>
          <div class="text-center">
            <h3 class="text-2xl font-bold">{props.block.name}</h3>

            <p class="text-gray-500">{props.block.description}</p>
          </div>

          <ChooseBlockTypeForm
            onCancel={props.handleClose}
            onSubmit={() => setStepIndex((stepIndex) => stepIndex + 1)}
          />
        </Match>

        <Match when={stepIndex() === 1}>
          <div class="text-center">
            <h3 class="text-2xl font-bold">Select your repository</h3>

            <p class="text-gray-500">
              We will track the star from this repository
            </p>
          </div>

          <ErrorBoundary
            fallback={(error, reset) => (
              <div
                class="w-full flex flex-col justify-center items-center gap-4 font-semibold"
                style="min-height: 120px;"
              >
                <p>Oops, something went very wrong.</p>

                <button onClick={reset} type="button" class="clickable-text">
                  Retry
                </button>
              </div>
            )}
          >
            <SearchRepoForm />
          </ErrorBoundary>
        </Match>
      </Switch>
    </div>
  );
};

const ChooseBlockTypeForm: Component<{
  onCancel: () => void;
  onSubmit: () => void;
}> = (props) => {
  const [current, setCurrent] = createSignal<number>(0);

  const availableBlockComponents = () => [
    blocks()[0].Component,
    blocks()[1].Component,
    blocks()[2].Component,
  ];

  const selectedBlockComponent = () => availableBlockComponents()[current()];

  const prev = () =>
    setCurrent((current) => (current > 0 ? current - 1 : current));

  const next = () =>
    setCurrent((current) =>
      current < availableBlockComponents().length ? current + 1 : current
    );

  hotkeys("left", (e) => {
    e.preventDefault();
    prev();
  });

  hotkeys("right", (e) => {
    e.preventDefault();
    next();
  });

  onCleanup(() => {
    hotkeys.unbind("left");
    hotkeys.unbind("right");
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit();
      }}
    >
      <div class="my-10">
        <div class="small-card mb-4 shadow-2xl ring ring-gray-700 ring-offset-4 ring-offset-gray-900">
          <Dynamic component={selectedBlockComponent()} />
        </div>

        <Stepper
          current={current()}
          max={availableBlockComponents().length}
          onChange={(current) => setCurrent(current)}
        />
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

const SearchRepoForm: Component = () => {
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
    <>
      <div class="my-6">
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
          <span class="font-mono">Find your repository by name</span> ☝️
        </Show>

        <Show when={selectedRepo()}>
          <ul class="flex flex-col gap-2 w-full bg-gray-800 py-2 px-4 rounded-lg">
            <li>
              <button
                onClick={() => setSelectedRepo(null)}
                type="button"
                class="cursor-pointer flex gap-3 items-center"
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
                      class="cursor-pointer flex gap-3 items-center"
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
    </>
  );
};

const Stepper: Component<{
  current: number;
  max: number;
  onChange: (current) => void;
}> = (props) => {
  return (
    <div class="flex justify-center items-center gap-3">
      <Index each={new Array(props.max)}>
        {(_, index) => {
          const active = () => index === props.current;

          return (
            <button
              type="button"
              class="w-2 h-2 rounded-full cursor-pointer"
              onClick={() => props.onChange(index)}
              classList={{
                "bg-red-600": active(),
                "bg-gray-200": !active(),
              }}
            />
          );
        }}
      </Index>
    </div>
  );
};
