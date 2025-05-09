import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private _userService:UserService) {}
    @Get()
    findAll() {
        // Logic to fetch all users
        return 'This action returns all users';
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        // Logic to fetch a user by ID
        return `This action returns user with id: ${id}`;
    }

    @Post()
    create(@Body() {email}: {email:string}) {
        // Logic to create a new user
        return this._userService.createUser(email)
    }
}