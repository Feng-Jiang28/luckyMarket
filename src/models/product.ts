import { Product as MedusaProduct } from "@medusajs/medusa";
import { Entity } from "typeorm";

@Entity()
export class Product extends MedusaProduct {
  // ...
}
