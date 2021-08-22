This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

In addition to Next.js, this project utilizes [React](https://reactjs.org/), [Material UI](https://material-ui.com/), [Knex](https://knexjs.org/), and a [sqllite](https://www.sqlite.org/index.html) database

## Getting Started
First, in order to create and populate a sqllite database:

```bash
npm run seed
```

This will create the database with 'users', 'favorites', and 'unis' tables. This script populates the 'unis' table using the api response at https://universities.hipolabs.com/search

Then you should be ready to run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application in action!


[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed as such: [http://localhost:3000/api/unis](http://localhost:3000/api/unis).

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Features
This application includes the following features: 
- Searching the database of universities by name and filtering by country
- Authentication in order to 'favorite' universities, storing them in their own view. Favorites can be toggled using the <3 icons for logged in users. 
- Email and password validation 
- A global 'error banner' for reporting errors to users
- Linting (ESlint) and Prettier configurations ```npm run lint```

## Testing
Tests have been implemented using Jest and React Testing Library

Tests can be run (with coverage) with: 
```bash
npm run test
```

## Still To Come
- More tests!
- More types / better type safety
- Resolve errors during test runs
- Resolve eslint warnings
