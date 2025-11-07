import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { ILike, In, Repository } from 'typeorm';
import { PermissionsService } from '../permissions/permissions.service';
import { AssignPermissionsToRoleDto } from './dto/request/assign-permissions.dto';
import { AssignAdminsToRoleDto } from './dto/request/assign-admins.dto';
import { UserService } from '../users/user.service';
import { SearchRoleDto } from './dto/request/search-role.dto';
import { PaginatedResult } from '@/types/types';
import { validateId } from '@/util';
import { validate } from 'class-validator';
import { CreateUpdateRoleDto } from './dto/request/create-update-role.dto';
import { AssignRolesToAdminDto } from '../users/dto/request/assign-roles.dto';
import { User } from '../users/user.entity';

@Injectable()
export class RolesService {
  // Roles service implementation
  constructor(
    @InjectRepository(Role) private _roleRepo: Repository<Role>,
    private readonly permissionsService: PermissionsService,
    private readonly userService: UserService,
  ) {}

  /**
   * Create a new role
   */
  async createRole(
    roleData: CreateUpdateRoleDto,
  ): Promise<{ message: string; role: Role }> {
    const { name, description, permissionsIds } = roleData;
    const existing = await this._roleRepo.findOne({
      where: { name },
    });
    if (existing) {
      const errMessage: string = 'Role with this name already exists';
      throw new BadRequestException(errMessage);
    }
    const permissions =
      await this.permissionsService.getPermissionsByIds(permissionsIds);
    if (permissions.length !== permissionsIds.length) {
      throw new BadRequestException('Some permissions were not found');
    }
    const role = this._roleRepo.create({
      name,
      description,
      permissions,
    });
    const createdRole = await this._roleRepo.save(role);
    return {
      message: 'Role created successfully',
      role: createdRole,
    };
  }
  /**
   * Update role
   */
  async updateRole(
    id: number,
    roleData: CreateUpdateRoleDto,
  ): Promise<{ message: string; role: Role }> {
    const { permissionsIds } = roleData;
    const role = await this.getRoleById(id);
    const permissions =
      await this.permissionsService.getPermissionsByIds(permissionsIds);
    if (permissions.length !== roleData.permissionsIds.length) {
      throw new BadRequestException('Some permissions were not found');
    }
    const updatedRole = {
      ...role,
      ...roleData,
      permissions,
    };
    await this._roleRepo.save(updatedRole);
    return {
      message: 'Role Updated successfully',
      role: updatedRole,
    };
  }
  /*
   * Assign permissions to role
   */
  async assignPermissionsToRole(
    body: AssignPermissionsToRoleDto,
    roleId: number,
  ): Promise<{ message: string; role: Role }> {
    const role = await this.getRoleById(roleId);
    const { permissionsIds } = body;
    const permissions =
      await this.permissionsService.getPermissionsByIds(permissionsIds);
    if (permissions.length !== permissionsIds.length) {
      throw new BadRequestException('Some permissions were not found');
    }
    role.permissions = permissions;
    const updatedRole = await this._roleRepo.save(role);
    return {
      message: 'Permissions assigned successfully',
      role: updatedRole,
    };
  }
  /*
   * Assign admins to role
   */
  async assignAdminsToRole(
    body: AssignAdminsToRoleDto,
    roleId: number,
  ): Promise<{ message: string; role: Role }> {
    const role = await this.getRoleById(roleId);
    const { adminsIds } = body;
    const admins = await this.userService.findAdminsByIds(adminsIds);
    if (admins.length !== adminsIds.length) {
      throw new BadRequestException('Some admins were not found');
    }
    role.admins = admins;
    const updatedRole = await this._roleRepo.save(role);
    return {
      message: 'Admins assigned successfully',
      role: updatedRole,
    };
  }
  /*
   * Assign admins to role
   */
  async assignRolesToAdmin(
    body: AssignRolesToAdminDto,
    adminId: number,
  ): Promise<{ message: string; user: User }> {
    const admin = await this.userService.findAdminById(adminId);
    const { rolesIds } = body;
    const roles = await this.getRolesByIds(rolesIds);
    if (roles.length !== rolesIds.length) {
      throw new BadRequestException('Some roles were not found');
    }
    admin.roles = roles;
    const updatedAdmins = await this.userService.save(admin);
    return {
      message: 'Roles assigned successfully',
      user: updatedAdmins,
    };
  }
  /**
   * Get roles by ids
   */
  async getRolesByIds(ids: number[]): Promise<Role[]> {
    if (!ids.length) {
      return [];
    }
    // This will throw automatically if any ID is invalid
    ids.forEach((id) => validateId(id));
    const roles = await this._roleRepo.find({
      where: { id: In(ids.map((id) => Number(id))) },
    });
    return roles;
  }
  /**
   * get role by id
   */
  async getRoleById(roleId: number): Promise<Role> {
    const role = await this._roleRepo.findOne({
      where: { id: validateId(roleId) },
      relations: {
        permissions: true,
        admins: true,
      },
    });
    if (!role) {
      throw new NotFoundException('Role Not Found');
    }
    return role;
  }

  /**
   * get role by name
   */
  async getRoleByName(name: string): Promise<Role> {
    const role = await this._roleRepo.findOne({
      where: { name },
      relations: {
        permissions: true,
        admins: true,
      },
    });
    if (!role) {
      throw new NotFoundException('Role Not Found');
    }
    return role;
  }
  

  /**
   * Get roles with pagination
   */
  async getRoles({
    page = 1,
    perPage = 10,
    query
  }: SearchRoleDto): Promise<PaginatedResult<Role>> {
    const skip = (page - 1) * perPage;
      const where = query
    ? [
        { name: ILike(`%${query}%`) }, // PostgreSQL: case-insensitive LIKE
        { description: ILike(`%${query}%`) }, // optional if you want to search description too
      ]
    : undefined;
    const [permissions, total] = await this._roleRepo.findAndCount({
      where,
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
   * Get all roles
   */
  getAllRoles(): Promise<Role[]> {
    return this._roleRepo.find();
  }

  /**
   * Delete role by id
   */
  async deleteRole(id: number): Promise<{ message: string; role: Role }> {
    const role = await this.getRoleById(id);
    const deletedRole = await this._roleRepo.remove(role);
    return {
      message: 'Role deleted successfully',
      role: deletedRole,
    };
  }

  /**
   * assign super admin role to super admin
   * @param superAdminId
   */
  async assignSuperAdminRoleToSuperAdmin(
    superAdminId: number,
    superAdminRoleId: number,
  ) {
    // assign super_admin role to super_admin user
    return this.assignAdminsToRole(
      { adminsIds: [validateId(superAdminId)] },
      validateId(superAdminRoleId),
    );
  }
}
