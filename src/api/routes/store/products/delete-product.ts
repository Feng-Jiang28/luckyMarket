import {ProductService} from "@medusajs/medusa";
import {EntityManager} from "typeorm";

export default async(req, res) =>  {
    const {id} = req.params

    const productService: ProductService = req.scope.resolve("productService");
    const manager: EntityManager = req.scope.resolve("manager");
    await manager.transaction(async (transactionManager) =>{
        return await productService.withTransaction(transactionManager).delete(id)
    })

    res.json({
        id,
        object: "product",
        deleted: true,
    })
}
