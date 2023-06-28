import { CustomerService } from "@medusajs/medusa"
import { Customer } from "../../models/customer"

export async function registerLoggedInUser(req, res, next) {
     let loggedInCustomer: Customer | null = null

     if (req.customer && req.customer.id) {
          const customerService =
              req.scope.resolve("customerService") as CustomerService
          loggedInCustomer = await customerService.retrieve(req.customer.id)
     }

     req.scope.register({
          loggedInCustomer: {
               resolve: () => loggedInCustomer,
          },
     })

     next()
}
