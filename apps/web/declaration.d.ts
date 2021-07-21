declare module "*.svg";
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";

interface ImportMetaEnv {
  VITE_API_URL: string;

  VITE_GITHUB_API_KEY: string;

  VITE_AUTH0_DOMAIN: string;
  VITE_AUTH0_CLIENT_ID: string;
  VITE_AUTH0_CLIENT_SECRET: string;
}
