import { useAuth0 } from "@rturnq/solid-auth0";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      onClick={() => loginWithRedirect()}
      type="button"
      class="ml-6 inline-flex items-center px-8 py-2 border border-transparent font-medium shadow-sm text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
    >
      Login
    </button>
  );
};

export default LoginButton;
