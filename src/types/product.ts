import {IsOptional, IsString} from "class-validator";

export class ProductProductCategoryReq {
    @IsString()
    id: string
}

export class ProductTagReq {
    @IsString()
    @IsOptional()
    id?: string

    @IsString()
    value: string
}
