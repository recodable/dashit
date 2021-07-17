import type { Component } from "solid-js";
import LoginButton from "../LoginButton";

const NeedAuth: Component = () => {
  return (
    <div class="w-screen h-screen flex flex-col justify-center items-center gap-4">
      <span class="text-5xl font-bold">Unauthorized</span>

      <p class="text-2xl font-light text-gray-500">
        You need to be logged in to access this page.
      </p>

      <LoginButton />
    </div>
  );
};

export default NeedAuth;
