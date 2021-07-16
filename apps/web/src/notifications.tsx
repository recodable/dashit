import { Loading } from "./icons";

export const UpdatingNotification = () => {
  return (
    <div
      class="px-8 py-5 shadow-xl bg-black rounded-lg flex gap-2 items-center text-white"
      style="width: 300px;"
    >
      <Loading class="w-6 h-6" />
      <span class="text-xl font-semibold">Updating...</span>
    </div>
  );
};

export const SuccessfullyUpdatedNotification = () => {
  return (
    <div
      class="px-8 py-5 shadow-xl bg-green-600 rounded-lg flex gap-2 items-center text-green-100 text-center"
      style="width: 300px;"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 13l4 4L19 7"
        />
      </svg>

      <span>Done</span>
    </div>
  );
};
