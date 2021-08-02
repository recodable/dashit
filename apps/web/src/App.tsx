import type { Component } from "solid-js";
import {
  ModalProvider,
  ModalBackground as BaseModalBackground,
  ToasterBag,
} from "@guillotin/solid";
import { Route } from "solid-app-router";
import Navbar from "./Navbar";

const App: Component = () => {
  return (
    <ModalProvider
      Background={(props) => (
        <BaseModalBackground backgroundColor="black" opacity={0.8} {...props} />
      )}
    >
      <ToasterBag x="center" y="bottom">
        <div class="min-h-screen min-w-screen pt-16">
          <Navbar />

          <main class="-pt-16">
            <Route />
          </main>
        </div>
      </ToasterBag>
    </ModalProvider>
  );
};

export default App;

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
