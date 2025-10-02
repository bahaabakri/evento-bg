import { Expose } from "class-transformer";
import { ImageObject } from "src/types/types";
export class HeroDto {
    @Expose()
    id: number;

    @Expose()
    isActive: boolean;

    @Expose()
    images: ImageObject[];
}