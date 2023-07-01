import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsOptional,
    IsString,
    ValidateNested,
} from "class-validator"

import {
    defaultStoreProductFields,
    defaultStoreProductRelations
} from "."

import {
    PricingService,
    ProductService,
    ProductStatus,
    ShippingProfileService,

} from "@medusajs/medusa"

import { Type } from "class-transformer"
import { EntityManager } from "typeorm"
import {ProductProductCategoryReq, ProductTagReq} from "@medusajs/medusa/dist/types/product";
import {validator} from "@medusajs/medusa/dist/utils/validator";


/**
 * @oas [post] /store/products
 * operationId: "PostProducts"
 * summary: "Create a Product"
 * x-authenticated: true
 * description: "Creates a Product"
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/StorePostProductsReq"
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Products
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminProductsRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */

export default async (req, res) => {

    const validated = await validator(StorePostProductsReq, req.body)
    const productService: ProductService = req.scope.resolve("productService")
    // const pricingService: PricingService = req.scope.resolve("pricingService")
    const shippingProfileService: ShippingProfileService = req.scope.resolve(
        "shippingProfileService"
    )

    const entityManager: EntityManager = req.scope.resolve("manager")

    const newProduct = await entityManager.transaction(async (manager) => {

        if (validated.images && validated.images.length) {
            validated.thumbnail = validated.images[0]
        }

        let shippingProfile

        shippingProfile = await shippingProfileService
                .withTransaction(manager)
                .retrieveDefault()

        const newProduct = await productService
            .withTransaction(manager)
            .create({ ...validated, profile_id: shippingProfile.id })

        return newProduct
    })

    res.json({ newProduct})
}

/**
 * @schema StorePostProductsReq
 * type: object
 * required:
 *   - title
 * properties:
 *   title:
 *     description: "The title of the Product"
 *     type: string
 *   subtitle:
 *     description: "The subtitle of the Product"
 *     type: string
 *   description:
 *     description: "A description of the Product."
 *     type: string
 *   discountable:
 *     description: A flag to indicate if discounts can be applied to the LineItems generated from this Product
 *     type: boolean
 *     default: true
 *   images:
 *     description: Images of the Product.
 *     type: array
 *     items:
 *       type: string
 *   status:
 *     description: The status of the product.
 *     type: string
 *     enum: [draft, proposed, published, rejected]
 *     default: draft
 *   tags:
 *     description: Tags to associate the Product with.
 *     type: array
 *     items:
 *       type: object
 *       required:
 *         - value
 *       properties:
 *         id:
 *           description: The ID of an existing Tag.
 *           type: string
 *         value:
 *           description: The value of the Tag, these will be upserted.
 *           type: string
 *   categories:
 *     description: "Categories to add the Product to."
 *     type: array
 *     items:
 *       required:
 *         - id
 *       properties:
 *         id:
 *           description: The ID of a Product Category.
 *           type: string
 *   metadata:
 *     description: An optional set of key-value pairs with additional information.
 *     type: object
 */
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
