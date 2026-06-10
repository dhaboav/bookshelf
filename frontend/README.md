# Bookshelf Project - Frontend

A modern, fast, and organized web application to manage your personal library. Built using **Vite**, **React**, **TypeScript**, **TanStack (Query & Router)**, and **Tailwind CSS**.

## Requirements

Before you start, make sure you have installed:
- [Node.js](https://nodejs.org/) (The engine that runs our JavaScript tools).

## Code Structure

We organize our code using **Feature-Sliced Design (FSD)**. Think of our application like a giant Lego set or a restaurant, where every folder has one strict, simple job:

* `app/` (**The Foundation**) — Sets up the global rules, styles, and data pathways for the entire app.
* `pages/` (**The Screens**) — What the user actually sees (e.g., Books page, Authors page). It stitches together features and entities like a full recipe.
* `widgets/` (**The Big Blocks**) — Complex, standalone parts of a screen, like a permanent Sidebar or Header.
* `features/` (**The Actions**) — What the user can *do* (e.g., Click to "Delete Author" or "Edit Genre"). 
* `entities/` (**The Business Concepts**) — The real-world objects we deal with, like a `BookCard` or an Author's profile.
* `shared/` (**The Lego Bricks**) — Tiny, reusable pieces that don't care about business logic (e.g., standard buttons, empty state banners, or a generic pagination wrapper).

> **The Golden Rule:** Code from a lower layer (like `shared`) can never peek or borrow code from a higher layer (like `pages`). This keeps our app clean and prevents unexpected bugs!

## Quick Start

Get your local development server up and running in two simple steps:

```bash
npm install     # 1. Download all dependencies
npm run dev     # 2. Start the live-reload server
```
After that, open your browser and go to: http://localhost:5173/

> 💡**Developer Tip:** For the fastest experience with instant code updates, run this server directly on your local machine instead of inside Docker. Save Docker for later when you want to test how the app behaves in a production-ready environment.

## Connecting to a Remote API

By default, the frontend is configured to talk to your local backend server. If you want it to communicate with a live production server or a remote API instead, simply add or change this line in your `frontend/.env` file:

```
VITE_API_URL=[https://api.my-domain.example.com](https://api.my-domain.example.com)
```

Once saved, the frontend will automatically switch and use this new URL as its main data source.