import { CustomerService } from "@medusajs/medusa"
import { Customer } from "../../models/customer"

export async function registerLoggedInCustomer(req, res, next) {
     let loggedInCustomer: Customer | null = null
     console.log(req.user);
     if (req.user && req.user.customer_id) {
          const customerService =
              req.scope.resolve("customerService") as CustomerService
          loggedInCustomer = await customerService.retrieve(req.user.customer_id)
     }

     req.scope.register({
          loggedInCustomer: {
               resolve: () => loggedInCustomer,
          },
     })

     next()
}
