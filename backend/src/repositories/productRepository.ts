import { readJson } from "../utils/fileUtils"
import { Component, Product } from "../interfaces/warehouse";

export const getComponentsOfProduct = async (productId: string) => {
    const products: Product[] = await readJson('products');

    const targetProduct = products.filter(product => product.productId === productId)[0];

    let componentNames: string[] = [];
    if (targetProduct) {
        if (targetProduct.components.length > 0) {
            componentNames = targetProduct.components.map(component => component.componentName);
        }
    }

    return componentNames;
}