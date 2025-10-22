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
import { PermissionsGuard } from './guards/permissions.guard';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsService } from './permissions.service';
import { PaginatedPermissionsDto } from './dto/response/paginated-permissions.dto';
import { SearchPermissionDto } from './dto/request/search-permission.dto';
import { PermissionDto } from './dto/response/permission.dto';
import { PermissionResponseDto } from './dto/response/permission-response.dto';
import { CreatePermissionDto } from './dto/request/create-permission.dto';
import Serialize from '@/decorators/serialize.decorator';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { Permissions } from './decorators/permissions.decorator';
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('admin/permissions')
export class PermissionsController {
  constructor(private _permissionsService: PermissionsService) {}
  ////////////////// get apis for permissions //////////////////
  @Serialize(PaginatedPermissionsDto)
  @Permissions('view_permissions')
  @Get()
  @ApiOperation({ summary: 'Get Permissions' })
  async getPermissions(@Query() query: SearchPermissionDto) {
    return this._permissionsService.getPermissions(query);
  }
  @Serialize(PermissionDto)
  @Permissions('view_permissions')
  @Get(':id')
  @ApiOperation({ summary: 'Get Permission by id' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 42,
    description: 'Permission ID',
  })
  async getPermissionById(@Param('id') id: number) {
    return this._permissionsService.getPermissionById(id);
  }

  @Serialize(PermissionResponseDto)
  @Permissions('create_permissions')
  @Post()
  @ApiOperation({ summary: 'Create new Permission' })
  async createPermission(@Body() permissionData: CreatePermissionDto) {
    return this._permissionsService.createPermission(permissionData);
  }

  @Serialize(PermissionResponseDto)
  @Permissions('delete_permissions')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Permission' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 42,
    description: 'Permission ID',
  })
  async deletePermission(@Param('id') id: number) {
    return this._permissionsService.deletePermission(id);
  }
}
