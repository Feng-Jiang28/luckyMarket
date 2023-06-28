import { Entity } from "typeorm"
import {
    Store as MedusaStore,
} from "@medusajs/medusa"

@Entity()
export class Store extends MedusaStore {
    // TODO add relations
}
