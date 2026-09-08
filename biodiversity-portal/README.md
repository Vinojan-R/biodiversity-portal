# Biodiversity Portal

## Local API setup

1. Create a MongoDB Atlas database and allow your development IP address in Network Access.
2. In `server/.env`, replace the placeholder `MONGODB_URI` with the connection string from Atlas. URL-encode special characters in the database password.
3. Start the API from the `server` directory with `npm run dev`.
4. Start the frontend from the project root with `npm run dev`.
5. Register normally at `/register`. Once the account exists, grant admin access from the server directory:

	`npm run make-admin -- your-email@example.com`

Sign out and sign back in after granting the role. The Admin link will then appear in the navigation.

## Google sign-in setup

Create a Google OAuth 2.0 Web application in Google Cloud Console. Add this exact authorized redirect URI:

`http://localhost:5000/api/auth/google/callback`

Copy the client ID and secret into `server/.env` as `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`. Set `GOOGLE_CALLBACK_URL` to the same redirect URI. For production, use your HTTPS API callback URL and add that URL in Google Cloud Console as well.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
