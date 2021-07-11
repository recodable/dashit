import { Link } from "solid-app-router";
import type { Component } from "solid-js";

const NotFound: Component = () => {
  return (
    <div class="w-screen h-screen flex flex-col justify-center items-center gap-4">
      <h1 class="text-5xl font-bold">404</h1>

      <p class="text-2xl font-light text-gray-500">
        It looks like you reached an impasse
      </p>

      <Link href="/" class="clickable-text">
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
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>

        <span>Take me back</span>
      </Link>
    </div>
  );
};

export default NotFound;
