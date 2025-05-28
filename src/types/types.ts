import { User } from "src/users/user.entity";

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