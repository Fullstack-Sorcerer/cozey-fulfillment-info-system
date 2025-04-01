import { getComponentsOfProduct } from "../../src/repositories/productRepository";
import mockProductData from "../mock/products.json";
import { readJson } from "../../src/utils/fileUtils";


jest.mock("../../src/utils/fileUtils", () => ({
    readJson: jest.fn()
}));

beforeEach(() => {
    jest.clearAllMocks();
});

describe("getComponentsOfProduct", () => {
    it("should return correct components for a given productId", async () => {
        (readJson as jest.Mock).mockResolvedValueOnce(mockProductData);

        const productId = "valentines-box";
        const mockComponents = mockProductData.find(product => product.productId === productId)?.components.map(component => component.componentName) || [];
        
        const components = await getComponentsOfProduct(productId);

        expect(components).toEqual(mockComponents);
        expect(readJson).toHaveBeenCalledWith("products");
        expect(readJson).toHaveBeenCalledTimes(1);
    });

    it("should return an empty array if the product is not found", async () => {
        (readJson as jest.Mock).mockResolvedValueOnce(mockProductData);

        const productId = "nonexistent-product";
        const components = await getComponentsOfProduct(productId);

        expect(components).toEqual([]);
        expect(readJson).toHaveBeenCalledWith("products");
        expect(readJson).toHaveBeenCalledTimes(1);
    });
});

