import { Customer as MedusaCustomer } from "@medusajs/medusa";
import { Entity } from "typeorm";

@Entity()
export class Customer extends MedusaCustomer {
  
}