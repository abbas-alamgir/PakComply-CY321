/// <reference types="vite/client" />
import '@testing-library/jest-dom/vitest';

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.css';
