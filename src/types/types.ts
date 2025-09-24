
// This file contains type definitions and interfaces used across the application.
// modify request object to include currentUser and currentAdmin
declare global {
    namespace Express {
        interface Request {
            currentUser?:User;
            currentAdmin?:User
        }
    }
}
export type ClassType<T> = new (...args: any[]) => T;

export type ImageObject = {
  id: string;
  name: string;
  url: string;
};

export interface PaginationMeta {
  total: number;
  page: number;
  perPage: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta?: PaginationMeta;
}