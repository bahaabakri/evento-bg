import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import Serialize from '@/decorators/serialize.decorator';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { RoleDto } from './dto/response/role.dto';
import { PermissionsGuard } from '../permissions/guards/permissions.guard';
import { Permissions } from '../permissions/decorators/permissions.decorator';
import { PaginatedRolesDto } from './dto/response/paginated-roles.dto';
import { SearchRoleDto } from './dto/request/search-role.dto';
import { RoleResponseDto } from './dto/response/role-response.dto';
import { CreateRoleDto } from './dto/request/create-role.dto';
import { AssignPermissionsToRoleDto } from './dto/request/assign-permissions.dto';
import { AssignAdminsToRoleDto } from './dto/request/assign-admins.dto';
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('admin/roles')
export class RolesController {
  constructor(private _rolesService:RolesService) {}
  ////////////////// get apis for roles //////////////////
  @Serialize(PaginatedRolesDto)
  @Permissions('view_roles')
  @Get()
  @ApiOperation({ summary: 'Get Roles' })
  async getPermissions(@Query() query: SearchRoleDto) {
    return this._rolesService.getRoles(query);
  }

  @Serialize(RoleDto)
  @Permissions('view_roles')
  @Get(':id')
  @ApiOperation({ summary: 'Get Role by id' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 42,
    description: 'Role ID',
  })
  async getRoleById(@Param('id') id: number) {
    return this._rolesService.getRoleById(id);
  }

  @Serialize(RoleResponseDto)
  @Permissions('create_roles')
  @Post()
  @ApiOperation({ summary: 'Create new Role' })
  async createPermission(@Body() roleData: CreateRoleDto) {
    return this._rolesService.createRole(roleData);
  }

  @Serialize(RoleResponseDto)
  @Permissions('delete_roles')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Role' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 42,
    description: 'Role ID',
  })
  async deleteRole(@Param('id') id: number) {
    return this._rolesService.deleteRole(id);
  }

  @Serialize(RoleResponseDto)
  @Permissions('assign_permissions_to_role')
  @Patch(':id/assign_permissions')
  @ApiOperation({summary: 'Assign Permissions To Role'})
  @ApiParam({
    name: 'id',
    type: Number,
    example: 3,
    description: 'Role ID'
  })
  async assignPermissionsToRole(@Param('id') id: number, @Body() assignPermissionsToRoleData: AssignPermissionsToRoleDto) {
    return this._rolesService.assignPermissionsToRole(assignPermissionsToRoleData, id)
  }

  @Serialize(RoleResponseDto)
  @Permissions('assign_admins_to_role')
  @Patch(':id/assign_admins')
  @ApiOperation({summary: 'Assign Admins To Role'})
  @ApiParam({
    name: 'id',
    type: Number,
    example: 3,
    description: 'Role ID'
  })
  async assignAdminsToRole(@Param('id') id: number, @Body() assignAdminsToRoleData: AssignAdminsToRoleDto) {
    return this._rolesService.assignAdminsToRole(assignAdminsToRoleData, id)
  }

}
