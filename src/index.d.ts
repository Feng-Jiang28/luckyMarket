export declare module "@medusajs/medusa/dist/models/store" {
    declare interface Store {
        // TODO add relations
        members?: Customer[];
        products?: Product[];
    }
}

export declare module "@medusajs/medusa/dist/models/customer"{
    declare interface Customer{
        store_id?: string;
        store?: Store;
    }
}


export declare module "@medusajs/medusa/dist/models/product" {
    declare interface Product {
        store_id?: string;
        store?: Store;
    }
}

