import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreatePermissionDto {
  @ApiProperty({
    example: 'users',
    description: 'Module Name (users, admins, events, tickets, plans)',
  })
  @IsString()
  moduleName: string;

  @ApiProperty({
    example: 'view',
    description: 'Action Name (create, view, update, delete, approve)',
  })
  @IsString()
  actionName: string;

  @ApiPropertyOptional({
    example: 'Allows viewing user details',
    description: 'A brief description of what the permission allows',
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional({
    example: 'create_users',
    description: 'permission slug (optional)',
  })
  @IsOptional()
  @IsString()
  slug?: string;
}