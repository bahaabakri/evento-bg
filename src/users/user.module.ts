import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserAdminController } from './user-admin.controller';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UserController, UserAdminController],
    providers: [UserService]
})
export class UserModule {}