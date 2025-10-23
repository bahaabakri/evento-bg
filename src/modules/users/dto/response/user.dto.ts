import { EventDto } from "@/modules/events/dto/response/event.dto";
import { EventEntity } from "@/modules/events/event.entity";
import { RoleDto } from "@/modules/roles/dto/response/role.dto";
import { Role } from "@/modules/roles/role.entity";
import { TicketDto } from "@/modules/tickets/dto/response/tickets.dto";
import { Expose, Type } from "class-transformer";
export class UserDto {
    @Expose()
    id: number;

    @Expose()
    email: string;

    @Expose()
    firstname: string;

    @Expose()
    lastname: string;

    @Expose()
    phone: string;

    @Expose()
    status: string;
    
    @Expose()
    isVerified: boolean;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    @Expose()
    @Type(() => EventDto)
    createdEvents: EventDto[];

    @Expose()
    @Type(() => TicketDto)
    joinedEvents: TicketDto[];

    @Expose()
    @Type(() => RoleDto)
    roles: Role[];
}