# Bookshelf Project - Frontend

The frontend user interface for the Bookshelf application, built with React, TypeScript, Vite, and Tailwind CSS.

## Architecture

This application follows Feature-Sliced Design (FSD) to maintain a scalable, modular architecture:

* `app/`— Global configuration, styling, and application providers.
* `pages/`— Page-level views composing features and widgets.
* `widgets/`— Self-contained UI blocks (e.g., Navigation headers, sidebars).
* `features/`— User action workflows (e.g., managing books, editing authors). 
* `entities/`— Core business objects and domain components (e.g., BookCard).
* `shared/`— Reusable, framework-agnostic UI elements and helpers.

> **The Golden Rule:** Code from a lower layer (like `shared`) can never peek or borrow code from a higher layer (like `pages`). This keeps our app clean and prevents unexpected bugs!

## Environment Configuration
Configure the backend API destination by defining VITE_API_URL in your frontend environment file:

```backend-address
VITE_API_URL=http://localhost:8000
```
