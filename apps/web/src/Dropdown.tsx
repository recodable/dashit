import type { Component } from "solid-js";
import { createSignal, onCleanup } from "solid-js";
import { Show, For, Switch, Match, Dynamic } from "solid-js/web";
import { useAuth0 } from "@rturnq/solid-auth0";

type Item = {
  name: string;
  onClick: () => void;
};

type TriggerProps = {
  onClick: () => void;
};

type Props = {
  items: Item[];
  trigger?: Component<TriggerProps>;
};

const Dropdown: Component<Props> = (props) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const { user } = useAuth0();

  const close = () => setIsOpen(false);

  window.addEventListener("click", close);

  onCleanup(() => window.removeEventListener("click", close));

  return (
    <div onClick={(e) => e.stopPropagation()} class="ml-3 relative">
      <Switch>
        <Match when={!!props.trigger}>
          <Dynamic
            component={props.trigger}
            onClick={() => setIsOpen((isOpen) => !isOpen)}
          />
        </Match>

        <Match when={true}>
          <button type="button" class="rounded-full hover:bg-gray-600 p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        </Match>
      </Switch>

      <Show when={isOpen()}>
        <div
          class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-black ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
          tabindex="-1"
        >
          {/* <a
                    href="#"
                    class="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabindex="-1"
                    id="user-menu-item-0"
                  >
                    Your Profile
                  </a> */}
          {/* <a
                    href="#"
                    class="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabindex="-1"
                    id="user-menu-item-1"
                  >
                    Settings
                  </a> */}
          <For each={props.items}>
            {(item) => {
              return (
                <button
                  onClick={item.onClick}
                  type="button"
                  class="block px-4 py-2 text-sm text-gray-200 hover:text-white"
                  role="menuitem"
                  tabindex="-1"
                  id="user-menu-item-2"
                >
                  {item.name}
                </button>
              );
            }}
          </For>
        </div>
      </Show>
    </div>
  );
};

export default Dropdown;
