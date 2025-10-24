import * as fs from 'fs';
import * as path from 'path';
import { UserType } from './modules/users/user-type.enum';
import { BadRequestException } from '@nestjs/common';

export async function deleteFileAsync(
  filename: string,
  directory = 'uploads',
): Promise<string> {
  const filePath = path.join(process.cwd(), directory, filename);
  return new Promise<string>((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(filename);
      }
    });
  });
}

export function isAdminPanelRole(userType: UserType): boolean {
  return userType !== UserType.USER;
}
export function validateId(id: number): number {
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw new BadRequestException('Wrong ID');
  }

  return numericId;
}
