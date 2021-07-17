import type { Component } from "solid-js";
import {
  ModalOutlet,
  ModalBackground as BaseModalBackground,
  ToasterBag,
} from "@guillotin/solid";
import { Route, Link } from "solid-app-router";
import { createSignal, createEffect } from "solid-js";
import { Show, Switch, Match } from "solid-js/web";
import { useAuth0 } from "@rturnq/solid-auth0";

const App: Component = () => {
  return (
    <div class="relative">
      <ModalOutlet
        Background={(props) => (
          <BaseModalBackground
            backgroundColor="black"
            opacity={0.8}
            {...props}
          />
        )}
      />

      <ToasterBag x="center" y="bottom" />

      <Navbar />

      <main class="bg-gray-900 min-h-screen min-w-screen text-white">
        <Route />
      </main>
    </div>
  );
};

export default App;

const Navbar = () => {
  // const [isAuth] = createSignal(false);
  const { isAuthenticated } = useAuth0();

  // createEffect(() => console.log(isAuthenticated()));

  return (
    <nav class="bg-gray-800">
      <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div class="relative flex items-center justify-between h-16">
          <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span class="sr-only">Open main menu</span>
              {/* <!--
            Icon when menu is closed.

            Heroicon name: outline/menu

            Menu open: "hidden", Menu closed: "block"
          --> */}
              <svg
                class="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* <!--
            Icon when menu is open.

            Heroicon name: outline/x

            Menu open: "block", Menu closed: "hidden"
          --> */}
              <svg
                class="hidden h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div class="flex-shrink-0 flex items-center">
              <Link href="/" class="font-bold text-2xl text-white">
                JumpDash
              </Link>
            </div>
            <div class="hidden sm:block sm:ml-6">
              <div class="flex space-x-4">
                {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
                {/* <a
                  href="#"
                  class="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                  aria-current="page"
                >
                  Dashboards
                </a> */}

                {/* <a
                  href="#"
                  class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Team
                </a> */}

                {/* <a
                  href="#"
                  class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Projects
                </a> */}

                {/* <a
                  href="#"
                  class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Calendar
                </a> */}
              </div>
            </div>
          </div>
          <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* <button class="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              <span class="sr-only">View notifications</span>
              <svg
                class="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button> */}

            {/* <!-- Profile dropdown --> */}
            <Switch>
              <Match when={isAuthenticated()}>
                <ProfileDropdown />
              </Match>

              <Match when={true}>
                <LoginButton />
              </Match>
            </Switch>
          </div>
        </div>
      </div>

      {/* <!-- Mobile menu, show/hide based on menu state. --> */}
      {/* <div class="sm:hidden" id="mobile-menu">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
          <a
            href="#"
            class="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
            aria-current="page"
          >
            Dashboard
          </a>

          <a
            href="#"
            class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Team
          </a>

          <a
            href="#"
            class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Projects
          </a>

          <a
            href="#"
            class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Calendar
          </a>
        </div>
      </div> */}
    </nav>
  );
};

// const CreateFormModal = (props) => {
//   return (
//     <div class="bg-gray-900 rounded-lg p-8 text-gray-200 overflow-hidden shadow-lg">
//       <h2 class="text-2xl">Add Blocks</h2>

//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//         }}
//       >
//         {/* <input type="text" name="name" placeholder="Name" /> */}

//         <div class="flex gap-2">
//           <button
//             type="submit"
//             class="px-5 py-3 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-lg text-lg font-semibold"
//           >
//             Add block
//           </button>

//           <button
//             type="button"
//             class="px-5 py-3 bg-gray-700 rounded-lg text-lg font-semibold"
//             onClick={props.handleClose}
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = createSignal(false);
  const { user, logout } = useAuth0();

  return (
    <div class="ml-3 relative">
      <div>
        <button
          type="button"
          class="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
          id="user-menu-button"
          aria-expanded="false"
          aria-haspopup="true"
          onClick={() => setIsOpen((isOpen) => !isOpen)}
        >
          <span class="sr-only">Open user menu</span>
          <img
            class="h-8 w-8 rounded-full"
            src={user()?.picture}
            alt="Your profile picture"
          />
        </button>
      </div>

      <Show when={isOpen()}>
        <div
          class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
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
          <button
            onClick={logout}
            type="button"
            class="block px-4 py-2 text-sm text-gray-700"
            role="menuitem"
            tabindex="-1"
            id="user-menu-item-2"
          >
            Sign out
          </button>
        </div>
      </Show>
    </div>
  );
};

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      onClick={() => loginWithRedirect()}
      type="button"
      class="ml-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
    >
      Login
    </button>
  );
};
