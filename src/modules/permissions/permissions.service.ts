import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './permission.entity';
import { In, Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/request/create-permission.dto';
import { SearchPermissionDto } from './dto/request/search-permission.dto';
import { PaginatedResult } from '@/types/types';

@Injectable()
export class PermissionsService {
  // Service methods would go here

  constructor(
    @InjectRepository(Permission)
    private _permissionRepo: Repository<Permission>,
  ) {}

  /**
   * Create a new permission
   */
  async createPermission(
    permissionData: CreatePermissionDto,
  ): Promise<{ message: string; permission: Permission }> {
    // Implementation for creating a permission
    const { slug, moduleName, actionName } = permissionData;
    const generatedSlug = slug || `${actionName}_${moduleName}`.toLowerCase();
    const name = `${actionName} ${moduleName}`.toLowerCase();

    const permission = this._permissionRepo.create({
      name,
      slug: generatedSlug,
      module: moduleName,
      action: actionName,
      description: permissionData.description,
    });
    const createdSavedPermission = await this._permissionRepo.save(permission);
    return {
      message: 'Event created successfully',
      permission: createdSavedPermission,
    };
  }

  /**
   * Get permissions pagination
   */
  async getPermissions({
    page = 1,
    perPage = 10,
  }: SearchPermissionDto): Promise<PaginatedResult<Permission>> {
    const skip = (page - 1) * perPage;
    const [permissions, total] = await this._permissionRepo.findAndCount({
      skip,
      take: perPage,
      order: { id: 'DESC' },
    });
    return {
      data: permissions,
      meta: { total, page, perPage },
    };
  }

  /**
   * get all permissions
   */
  getAllPermissions(): Promise<Permission[]> {
    return this._permissionRepo.find();
  }

  /** Get permission by id */
  async getPermissionById(id: number): Promise<Permission> {
    if (!id) {
      throw new NotFoundException('Permission Not Found');
    }
    const permission = await this._permissionRepo.findOne({
      where: { id },
      relations: {
        roles: true,
      },
    });
    if (!permission) {
      throw new NotFoundException('Permission Not Found');
    }
    return permission;
  }

  async getPermissionBySlug(slug: string) {
    if (!slug) {
      throw new NotFoundException('Slug is empty');
    }
    const permission = await this._permissionRepo.findOne({
      where: { slug }
    });
    if (!permission) {
      throw new NotFoundException('Permission with this slug Not Found');
    }
    return permission;
  }

  /**
   * Get permissions by ids
   */
  async getPermissionsByIds(ids: number[]): Promise<Permission[]> {
    if (!ids || ids.length === 0) {
      return [];
    }
    const permissions = await this._permissionRepo.find({
      where: { id: In(ids.map((id) => Number(id))) },
    });
    return permissions;
  }

  /**
   * Delete permission by id
   */
  async deletePermission(
    id: number,
  ): Promise<{ message: string; permission: Permission }> {
    const permission = await this.getPermissionById(id);
    const deletedPermission = await this._permissionRepo.remove(permission);
    return {
      message: 'Permission deleted successfully',
      permission: deletedPermission,
    };
  }
}
