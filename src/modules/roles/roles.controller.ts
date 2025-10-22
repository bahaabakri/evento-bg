import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('admin/roles')
export class RolesController {
  constructor(private _rolesService:RolesService) {}
  ////////////////// get apis for permissions //////////////////
//   @Serialize(PaginatedPermissionsDto)
//   @Permissions('view_roles')
//   @Get()
//   @ApiOperation({ summary: 'Get Permissions' })
//   async getPermissions(@Query() query: SearchPermissionDto) {
//     return this._permissionsService.getPermissions(query);
//   }
  @Serialize(RoleDto)
//   @Permissions('view_roles')
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

//   @Serialize(PermissionResponseDto)
//   @Permissions('create_permissions')
//   @Post()
//   @ApiOperation({ summary: 'Create new Permission' })
//   async createPermission(@Body() permissionData: CreatePermissionDto) {
//     return this._permissionsService.createPermission(permissionData);
//   }

//   @Serialize(PermissionResponseDto)
//   @Permissions('delete_permissions')
//   @Delete(':id')
//   @ApiOperation({ summary: 'Delete Permission' })
//   @ApiParam({
//     name: 'id',
//     type: Number,
//     example: 42,
//     description: 'Permission ID',
//   })
//   async deletePermission(@Param('id') id: number) {
//     return this._permissionsService.deletePermission(id);
//   }
}
