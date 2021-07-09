import type { Component } from "solid-js";
import {
  createSignal,
  createResource,
  createEffect,
  mergeProps,
} from "solid-js";
import { For, Dynamic, Show } from "solid-js/web";
import {
  ModalOutlet,
  setModal,
  ModalBackground as BaseModalBackground,
} from "@guillotin/solid";
import { Transition } from "solid-transition-group";
import gql from "graphql-tag";

const App: Component = () => {
  const [blocks, setBlocks] = createSignal([
    GithubStarBlock,
    GithubOpenIssueBlock,
    GithubOpenPullRequestBlock,
    // GithubStarBlock,
    // GithubStarBlock,
  ]);

  return (
    <>
      <ModalOutlet
        Background={(props) => (
          <BaseModalBackground
            backgroundColor="rgba(75, 85, 99, 1);"
            opacity={0.6}
            {...props}
          />
        )}
      />

      <main class="bg-gray-900 min-h-screen min-w-screen p-8 text-white">
        <h1 class="text-4xl font-bold">Recodable Dashboard</h1>

        <ul class="flex gap-4 py-6">
          <For each={blocks()}>
            {(Block) => {
              const [hovered, setHovered] = createSignal(false);

              return (
                <li
                  class="relative w-1/4 h-24 p-4 rounded-lg bg-gray-800 text-white hover:bg-gray-700 cursor-pointer shadow"
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                >
                  <Show when={hovered()}>
                    <div class="absolute top-0 right-0 px-3 py-2">
                      <select
                        name="timeFrame"
                        class="bg-gray-600 text-gray-400"
                      >
                        <option value="">All time</option>
                      </select>
                    </div>
                  </Show>

                  <Dynamic component={Block} />
                </li>
              );
            }}
          </For>
        </ul>

        <div class="py-10">
          <button
            type="button"
            class="bg-gray-800 w-full rounded-lg hover:bg-gray-700 py-4"
          >
            <span class="text-xl">+ Create new block</span>
          </button>
        </div>
      </main>
    </>
  );
};

export default App;

const createRepoStats = ({ user, repo }: { user: string; repo: string }) => {
  return createResource<{
    stargazers_count: number;
    open_issues_count: number;
  }>(() => {
    const url = `https://api.github.com/repos/${user}/${repo}`;
    return fetch(url).then((response) => response.json());
  });
};

const cache = [];

function createGithubGraphqlResource<R>(query: string) {
  return createResource<R>(() => {
    return fetch("https://api.github.com/graphql", {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_GITHUB_API_KEY}`,
      },
      body: JSON.stringify({ query }),
      method: "POST",
    }).then((response) => response.json());
  });
}

const GithubStarBlock = (props) => {
  props = mergeProps({ user: "solidjs", repo: "solid" }, props);

  const [data] = createRepoStats(props);

  return (
    <SimpleMetricBlock
      title="Github Stars"
      value={() => data().stargazers_count}
      loading={data.loading}
      uow="stars"
    />
  );
};

const GithubOpenIssueBlock = (props) => {
  props = mergeProps({ user: "solidjs", repo: "solid" }, props);

  const [data] = createRepoStats(props);

  return (
    <SimpleMetricBlock
      title="Github Issues"
      value={() => data().open_issues_count}
      loading={data.loading}
      uow="open issues"
    />
  );
};

// TODO: implement caching for graphql query (not possible with fetch atm because graphql request are POST)
const GithubOpenPullRequestBlock = (props) => {
  props = mergeProps({ user: "solidjs", repo: "solid" }, props);

  const [data] = createGithubGraphqlResource<{
    data: { repository: { pullRequests: { totalCount: number } } };
  }>(`
    {
      repository(owner: "mui-org", name: "material-ui") {
        pullRequests(states: OPEN) {
          totalCount
        }
      }
    }
  `);

  return (
    <SimpleMetricBlock
      title="Github PR"
      value={() => data().data.repository.pullRequests.totalCount}
      loading={data.loading}
      uow="open PR"
    />
  );
};

const SimpleMetricBlock: Component<{
  loading: boolean;
  title: string;
  value: () => string | number;
  uow: string;
}> = (props) => {
  return (
    <Show when={!props.loading}>
      <div class="rounded">
        <h4 class="text-lg font-thin text-gray-400">{props.title}</h4>

        <div class="flex gap-2 items-baseline">
          <span>
            <span class="text-4xl">{props.value()}</span>
            {/* <span class="text-2xl ml-0.5">k</span> */}
          </span>

          <span class="font-mono">{props.uow}</span>
        </div>
      </div>
    </Show>
  );
};

const ExampleModal = () => {
  return <div>My custom modal</div>;
};

const Select = () => {
  const [open, setOpen] = createSignal(false);

  return (
    <div class="relative inline-block text-left">
      <div>
        <button
          onClick={() => setOpen(!open())}
          type="button"
          class="rounded-full flex items-center text-gray-400 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
        >
          <span class="sr-only">Open options</span>
          {/* <!-- Heroicon name: solid/dots-vertical --> */}
          <svg
            class="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      <Transition
        enterActiveClass="transition ease-out duration-100"
        enterClass="transform opacity-0 scale-95"
        enterToClass="transform opacity-100 scale-100"
        exitActiveClass="transition ease-in duration-75"
        exitClass="transform opacity-100 scale-100"
        exitToClass="transform opacity-0 scale-95"
        appear
      >
        <Show when={open()}>
          <div
            class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabindex="-1"
          >
            <div class="py-1" role="none">
              {/* <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" --> */}
              <button
                type="button"
                class="text-gray-700 block px-4 py-2 text-sm"
                role="menuitem"
                tabindex="-1"
                id="menu-item-0"
              >
                All time
              </button>
            </div>
          </div>
        </Show>
      </Transition>
    </div>
  );
};
