import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";

@Injectable()

export class UserService {
    constructor(
        @InjectRepository(User) private _userRepo:Repository<User>,
    ) {}

    /**
     * create user in db
     * @param email 
     * @returns 
     */
    async createUser(email:string): Promise<User> {
        // create user in db
        const user = this._userRepo.create({
            email: email,
            isVerified:false
        })
        // save user in db
        return this.saveUser(user)
    }

    saveUser(user:User):Promise<User> {
       return  this._userRepo.save(user)
    }
    /**
     * find user by email
     */
    findUserByEmail(email:string):Promise<User | null> {
        return this._userRepo.findOneBy({email})
    }

    /**
     * find user by id
     */
    findUserById(id:number):Promise<User | null> {
        return this._userRepo.findOneBy({id})
    }

    /**
     * get all users
     */

    findAllUsers():Promise<User[]> {
        return this._userRepo.find()
    }


    /**
     * Remove user
     * @param id 
     * @returns 
     */
    async removeUser(id:number) {
        const user = await this.findUserById(id)
        if (!user) {
            throw new NotFoundException('User Not Found')
        }
        await this._userRepo.remove(user)
        return {
            message: 'User has been deleted successfully'
        }
    }
}