import * as fs from 'fs';
import * as path from 'path';
import { Role } from './users/roles.enum';

export async function deleteFileAsync(filename: string, directory = 'uploads'):Promise<string> {
    const filePath = path.join(process.cwd(), directory, filename);
    return new Promise<string>((resolve, reject) => {
        fs.unlink(filePath, (err) => {
          if (err) {
            reject(err)
          } else {
            resolve(filename)
          }
        });
    })
  }

export function isAdminPanelRole(role: Role): boolean {
  return role !== Role.USER;
}