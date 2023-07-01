import { Lifetime } from "awilix"
import { CustomerService as MedusaCustomerService } from "@medusajs/medusa"
import { Customer } from "../models/customer"
import { CreateCustomerInput as MedusaCreateCustomerInput } from "@medusajs/medusa/dist/types/customers"
import StoreRepository from "../repositories/store"

type CreateCustomerInput = {
    store_id?: string
} & MedusaCreateCustomerInput

class CustomerService extends MedusaCustomerService {
    static LIFE_TIME = Lifetime.SCOPED
    protected readonly loggedInCustomer_: Customer | null
    protected readonly storeRepository_: typeof StoreRepository;

    constructor(container, options) {
        // @ts-expect-error prefer-rest-params
        super(...arguments)
        this.storeRepository_ = container.storeRepository

        try {
            this.loggedInCustomer_ = container.loggedInUser
        } catch (e) {
            // avoid errors when backend first runs
        }
    }

    async create(customer: CreateCustomerInput): Promise<Customer> {
        if (!customer.store_id) {
            const storeRepo = this.manager_.withRepository(this.storeRepository_)
            let newStore = storeRepo.create()
            newStore = await storeRepo.save(newStore)
            customer.store_id = newStore.id
        }

        return await super.create(customer)
    }
}

export default CustomerService
