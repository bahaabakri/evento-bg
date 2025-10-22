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
}
