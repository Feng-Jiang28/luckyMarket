import {IsArray, IsBoolean, IsEnum, IsOptional, IsString, ValidateNested} from "class-validator";
import {Product, ProductService, ProductStatus} from "@medusajs/medusa";
import {Type} from "class-transformer";
import {ProductProductCategoryReq, ProductTagReq} from "@medusajs/medusa/dist/types/product";
import {validator} from "@medusajs/medusa/dist/utils/validator";
import {EntityManager} from "typeorm";


export default async (req, res) => {
    const { id } = req.params

    const validated = await validator(StorePostProductsReq, req.body)

    // const logger: Logger = req.scope.resolve("logger")

    const productService: ProductService = req.scope.resolve("productService")

    const manager: EntityManager = req.scope.resolve("manager")

    let product: Product;

    await manager.transaction(async (transactionManager) => {

        const productServiceTx = productService.withTransaction(transactionManager)

        product = await productServiceTx.update(id, validated)

    })

    res.json({ product })
}


export class StorePostProductsReq {
    @IsString()
    title: string

    @IsString()
    @IsOptional()
    subtitle?: string

    @IsString()
    @IsOptional()
    description?: string

    @IsBoolean()
    @IsOptional()
    discountable = true

    @IsArray()
    @IsOptional()
    images?: string[]

    @IsOptional()
    @IsEnum(ProductStatus)
    status?: ProductStatus = ProductStatus.DRAFT

    @IsOptional()
    @Type(() => ProductTagReq)
    @ValidateNested({ each: true })
    @IsArray()
    tags?: ProductTagReq[]

    @IsOptional()
    @Type(() => ProductProductCategoryReq)
    @ValidateNested({ each: true })
    @IsArray()
    categories?: ProductProductCategoryReq[]

    @IsString()
    @IsOptional()
    thumbnail?: string
}
