import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/request/create-role.dto';
import { PermissionsService } from '../permissions/permissions.service';
import { AssignPermissionsToRoleDto } from './dto/request/assign-permissions.dto';
import { AssignAdminsToRoleDto } from './dto/request/assign-admins.dto';
import { UserService } from '../users/user.service';
import { SearchRoleDto } from './dto/request/search-role.dto';
import { PaginatedResult } from '@/types/types';

@Injectable()
export class RolesService {
  // Roles service implementation
  constructor(
    @InjectRepository(Role) private _roleRepo: Repository<Role>,
    private readonly permissionsService: PermissionsService,
    private readonly userService: UserService
  ) {}

  /**
   * Create a new role
   */
  async createRole(
    roleData: CreateRoleDto,
  ): Promise<{ message: string; role: Role }> {
    const { name, description, permissionsIds } = roleData;
    const existing = await this._roleRepo.findOne({
        where: {name}
    })    
    if (existing) {
        const errMessage:string = 'Role with this name already exists'
        throw new BadRequestException(errMessage)
    }
    const permissions =
      await this.permissionsService.getPermissionsByIds(permissionsIds);
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
    const admins =
      await this.userService.findAdminsByIds(adminsIds);
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
  /**
   * get role by id
   */
  async getRoleById(roleId: number): Promise<Role> {
    if (!roleId) {
      throw new NotFoundException('Role Not Found');
    }
    const role = await this._roleRepo.findOne({
      where: { id: roleId },
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
    }: SearchRoleDto): Promise<PaginatedResult<Role>> {
      const skip = (page - 1) * perPage;
      const [roles, total] = await this._roleRepo.findAndCount({
        skip,
        take: perPage,
        order: { id: 'DESC' },
      });
      return {
        data: roles,
        meta: { total, page, perPage },
      };
    }

    /**
     * Get all roles
     */
    getAllRoles():Promise<Role[]> {
        return this._roleRepo.find()
    }


    /**
     * Delete role by id
     */
    async deleteRole(id:number):Promise<{message:string, role:Role}> {
        const role = await this.getRoleById(id);
        const deletedRole = await this._roleRepo.remove(role);
        return {
            message: 'Role deleted successfully',
            role: deletedRole
        }
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
      { adminsIds: [superAdminId] },
      superAdminRoleId,
    );
  }
}
