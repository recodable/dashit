import { Link } from "solid-app-router";
import type { Component } from "solid-js";
import { ArrowLeft } from "../icons";

const NotFound: Component = () => {
  return (
    <div class="screen gap-4">
      <span class="text-5xl font-bold">404</span>

      <p class="text-2xl font-light text-gray-500">
        It looks like you reached an impasse
      </p>

      <Link href="/" class="clickable-text">
        <ArrowLeft class="w-4 h-4" />

        <span>Take me back</span>
      </Link>
    </div>
  );
};

export default NotFound;
