import { Expose } from "class-transformer";
import { ImageObject } from "src/types/types";
export class HeroDto {
    @Expose()
    id: number;

    @Expose()
    name: string;
    
    @Expose()
    isActive: boolean;

    @Expose()
    images: ImageObject[];

    @Expose()
    title: string;

    @Expose()
    description: string;
}