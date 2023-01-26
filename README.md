# MakerKit - SaaS Starter for Remix and Firebase

MakerKit is a SaaS starter project built with Remix, Firebase and Tailwind
CSS.

This repository has been kickstarted using the Remix Indie Stack.

### What's in the stack

Some of the features that have been used from the Indie Stack are:

- [Fly app deployment](https://fly.io) with [Docker](https://www.docker.com/)
- [GitHub Actions](https://github.com/features/actions) for deploy on merge to production and staging environments
- Styling with [Tailwind](https://tailwindcss.com/)
- End-to-end testing with [Cypress](https://cypress.io)
- Unit testing with [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com)
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)

## Quick Start

### Requirements

- Node.js LTS (Please do not upgrade yet to Node 18)
- Firebase Tools
- Git

Assuming that yu have likely installed Node.js and Git, please also install
the `firebase-tools` package using `npm`:

```
npm i -g firebase-tools
```

If you have already installed it, please ensure that you are running the
latest version.

### Cloning the Repository

Clone this repository and name it according to your preferences:

```
git clone https://github.com/makerkit/remix-firebase-saas-kit.git your-saas
--depth=1
```

Move to the folder just cloned:

```
cd your-saas
```

Reinitialize Git and set this repository as your upstream fork, so you can
pull updates when needed:

```
rm -rf .git
git init
git remote add upstream https://github.com/makerkit/remix-firebase-saas-kit
```

We recommend to watch to the repository, so you know when there's an update.
To pull the latest updates, use:

```
git pull upstream main
```

In case we change the same files, you will need to resolve the conflicts.

Alternatively, you can cherry-pick changes so to reduce the amount of
conflicts across the files.

### Installing the Node Modules

Install the Node modules with the following command:

```
npm i
```

### Adding environment file

The kit comes with a template of what your `.env` file should look like named `.env.template`. Simply rename `.env.template` to `.env`.

This file won't be committed to git. When you deploy your production app, ensure you add the environment variables using your CI/Service.

### Starting the Remix server and the Firebase Emulators

Start the application and the Firebase emulators:

```
npm run dev
npm run firebase:emulators:start
```

The application should be running at [http://localhost:3000](http://localhost:3000).

Additionally, the [Firebase Emulators UI](https://firebase.google.
com/docs/emulator-suite) should be running at
[http://localhost:4000](http://localhost:4000).

If you're testing Stripe, also run the Stripe server:

```
npm run stripe:listen
```

Then, copy the printed webhook key and add it to your environment files.
This can also be used for running the E2E tests.

My recommendation is to add it to both `.env.test` and `.env.development`.

### After Creating your Firebase Project

Make sure to add the environment variables to the provider you're deploing.

### Running Tests

To run the Cypress tests, please run the command:

```
npm test:e2e
```

NB: this command will start all the services required, execute the tests and
then exit.

#### Stripe Testing

To run the Stripe tests and enable Stripe in development mode, you need to:

1. Enable the tests using the environment variable `ENABLE_STRIPE_TESTING` in
   `.env.test`
2. Have Docker installed and running in your local machine to run the Stripe
   Emulator
3. Generate a webhook key and set the environment variable
   `STRIPE_WEBHOOK_SECRET`

The first two steps are only required to run the Cypress E2E tests for
Stripe. Generating a webhook key and running the Stripe CLI server is
always required for developing your Stripe functionality locally.

To generate a webhook key, run the following command:

```
npm run stripe:listen
```

If it worked, it will print the webhook key. Then, paste it into
your environment files as `STRIPE_WEBHOOK_SECRET`.

This key is also needed to run Stripe during development to receive the
Stripe webhooks to your local server.

```
ENABLE_STRIPE_TESTING=true
```

### Full Documentation

To continue setting up your application, please take a look at [the official
documentation](https://makerkit.dev/docs/setting-up-firebase).

### Vitest

For lower level tests of utilities and individual components, we use `vitest`. We have DOM-specific assertion helpers via [`@testing-library/jest-dom`](https://testing-library.com/jest-dom).

### Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your editor to get a really great in-editor experience with type checking and auto-complete. To run type checking across the whole project, run `npm run typecheck`.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project. It's recommended to install an editor plugin (like the [VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)) to get auto-formatting on save. There's also a `npm run format` script you can run to format all files in the project.
