import { Expose, Transform } from "class-transformer";

export class EventDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    description: string;

    @Expose()
    date: string;

    @Expose()
    location: string;

    @Expose()
    lng: number;

    @Expose()
    lat: number;

    @Expose()
    isActive: boolean;

    @Expose()
    isApproved: boolean;

    @Expose()
    imagesUrls: string[];

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    @Transform(({ obj }) => obj.user?.id)
    @Expose()
    createdAdminId: number;
}