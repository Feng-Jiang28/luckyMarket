import { Entity, OneToMany } from "typeorm"
import { Store as MedusaStore} from "@medusajs/medusa"
import {Customer} from "./customer"
import { Product } from "./product";

@Entity()
export class Store extends MedusaStore{
    // TODO add relations
    @OneToMany(() => Customer, (customer) => customer?.store)
    members?: Customer[];

    @OneToMany(() => Product, (product) => product?.store)
    products?: Product[];
}
