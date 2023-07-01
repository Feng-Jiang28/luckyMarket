import {Product} from "../../../../models/product";

export const defaultStoreProductRelations = [
    "images",
    "tags",
    "categories"
]

export const defaultStoreProductFields: (keyof Product)[] = [
    "id",
    "title",
    "subtitle",
    "status",
    "external_id",
    "description",
    "discountable",
    "thumbnail",
    "profile_id",
    "created_at",
    "updated_at",
    "deleted_at",
    "metadata",
]
