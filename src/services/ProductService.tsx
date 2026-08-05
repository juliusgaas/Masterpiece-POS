import api from "../api/api";

export const ProductService = {

    getProducts() {
        return api.get("/products");
    },

    // Todo: Implement the product search functionality
    // push pending sales to the database




};