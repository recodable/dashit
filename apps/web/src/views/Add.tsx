import type { Component } from "solid-js";
import { createSignal, mergeProps } from "solid-js";
import { createStore } from "solid-js/store";
import { For, Dynamic, Show, Index, ErrorBoundary } from "solid-js/web";
import { TransitionGroup } from "solid-transition-group";
import { setModal } from "@guillotin/solid";
import SearchField from "../SearchField";
// import debounce from "lodash.debounce";
import { Link } from "solid-app-router";
import { ChevronLeft, PlusCircle } from "../icons";
import createHotkey from "../hotkey";
import registry from "../registry";
import type { Block } from "../types";
import { useRouter } from "solid-app-router";

const [blocks, setBlocks] = createSignal<Block[]>(registry);

const needBlockSetup = (block: Block): boolean => !!block.setup;

const CreateBlock: Component = () => {
  const [formData, setFormData] = createStore({ search: "" });

  const [router, { push }] = useRouter();

  const dashboardUrl = `/${router.params.id}`;

  return (
    <div class="p-16 flex flex-col justify-center items-center">
      <div style="width: 1024px;">
        <div class="my-12">
          <Link href={dashboardUrl} class="clickable-text mb-2">
            <ChevronLeft class="w-4 h-4" />
            <span>Back to dashboard</span>
          </Link>

          <div class="flex justify-between">
            <h1>Add Block</h1>

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
                    onClick={() => {
                      if (!needBlockSetup(block)) {
                        return push(dashboardUrl);
                      }

                      setModal({ Component: NewBlockModal, data: { block } });
                    }}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    class="small-card"
                  >
                    <Show when={hovered()}>
                      <div class="absolute inset-0 bg-purple-800 opacity-70 flex justify-center items-center text-purple-200">
                        <PlusCircle class="w-7 h-7" />
                      </div>
                    </Show>

                    <Dynamic<{ isPreview: boolean }>
                      component={block.Component}
                      isPreview
                    />
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

const createNewBlock = (
  dashboardId: string | number,
  block: Block,
  blockSettings: object
) => {
  return fetch(
    `${import.meta.env.VITE_API_URL}/dashboards/${dashboardId}/blocks`,
    {
      method: "POST",
      body: JSON.stringify({
        type: block.type,
        settings: blockSettings,
      }),
    }
  ).then((response) => response.json());
};

const NewBlockModal: Component<{ block: Block; closeModal: () => void }> = (
  props
) => {
  const [router, { push }] = useRouter();

  const [stepIndex, setStepIndex] = createSignal(0);

  const steps = [
    // false
    //   ? () => (
    //       <>
    //         <div class="text-center">
    //           <h3 class="text-2xl font-bold">{props.block.name}</h3>

    //           <p class="text-gray-500">{props.block.description}</p>
    //         </div>

    //         <ChooseBlockTypeForm
    //           onCancel={props.closeModal}
    //           onSubmit={() => setStepIndex((stepIndex) => stepIndex + 1)}
    //         />
    //       </>
    //     )
    //   : null,

    props.block.setup
      ? () => (
          <>
            <div class="text-center">
              <h3 class="text-2xl font-bold">{props.block.setup.name}</h3>

              <p class="text-gray-500">{props.block.setup.description}</p>
            </div>

            <ErrorBoundary
              fallback={(error, reset) => (
                <div
                  class="w-full flex flex-col justify-center items-center gap-4 font-semibold"
                  style="min-height: 240px;"
                >
                  <p>Oops, something went very wrong.</p>

                  <button onClick={reset} type="button" class="clickable-text">
                    Retry
                  </button>
                </div>
              )}
            >
              <Dynamic<{ onCancel: () => void; onSubmit: (data: any) => void }>
                component={props.block.setup.Component}
                onCancel={props.closeModal}
                onSubmit={async (settings) => {
                  await createNewBlock(
                    router.params.id as string,
                    props.block,
                    settings
                  );

                  props.closeModal();
                  push(`/${router.params.id}`);
                }}
              />
            </ErrorBoundary>
          </>
        )
      : null,
  ].filter((v) => v);

  const currentStep = () => steps[stepIndex()];

  return (
    <div
      class="relative rounded-lg bg-gray-900 p-10 text-white"
      style="width: 480px;"
    >
      <Dynamic component={currentStep()} />
    </div>
  );
};

const ChooseBlockTypeForm: Component<{
  availableBlockComponents?: Component[];
  onCancel: () => void;
  onSubmit: () => void;
}> = (props) => {
  props = mergeProps({ availableBlockComponents: [] }, props);

  const [current, setCurrent] = createSignal<number>(0);

  const selectedBlockComponent = () =>
    props.availableBlockComponents[current()];

  const prev = () =>
    setCurrent((current) => (current > 0 ? current - 1 : current));

  const next = () =>
    setCurrent((current) =>
      current < props.availableBlockComponents.length ? current + 1 : current
    );

  createHotkey("right", next);
  createHotkey("left", prev);

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
          max={props.availableBlockComponents.length}
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
