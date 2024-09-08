import 'express';

declare module 'express' {
  interface Request {
    user?: any; // Define a more specific type if possible
  }
}
