import { ProductService, Product } from "./ProductService";

describe("ProductService", () => {
    let service: ProductService;

    beforeEach(() => {
        // Initialize service with sample data before each test
        const initialProducts: Product[] = [
            { id: "1", name: "banana", quantity: 10, price: 15 },
            { id: "2", name: "apple", quantity: 5, price: 20 },
        ];
        service = new ProductService(initialProducts);
    });

    describe("getAll", () => {
        it("should return all products", () => {
            const products = service.getAll();
            expect(products).toHaveLength(2);
            expect(products[0].name).toBe("banana");
            expect(products[1].name).toBe("apple");
        });

        it("should return empty array for new service", () => {
            const emptyService = new ProductService();
            expect(emptyService.getAll()).toEqual([]);
        });
    });

    describe("getById", () => {
        it("should return product by id", () => {
            const product = service.getById("1");
            expect(product).not.toBeNull();
            expect(product?.name).toBe("banana");
            expect(product?.price).toBe(15);
        });

        it("should return null for non-existent id", () => {
            const product = service.getById("999");
            expect(product).toBeNull();
        });
    });

    describe("create", () => {
        it("should create a new product", () => {
            const newProduct: Product = { id: "3", name: "orange", quantity: 8, price: 12 };
            const created = service.create(newProduct);

            expect(created).not.toBeNull();
            expect(created?.id).toBe("3");
            expect(created?.name).toBe("orange");
        });

        it("should add product to the list", () => {
            const newProduct: Product = { id: "4", name: "grape", quantity: 20, price: 10 };
            service.create(newProduct);

            const retrieved = service.getById("4");
            expect(retrieved).not.toBeNull();
            expect(retrieved?.name).toBe("grape");
        });

        it("should return null for duplicate id", () => {
            const duplicate: Product = { id: "1", name: "different", quantity: 5, price: 5 };
            const created = service.create(duplicate);

            expect(created).toBeNull();
            // Original product should be unchanged
            expect(service.getById("1")?.name).toBe("banana");
        });

        it("should return null when product with same id already exists", () => {
            const existingProduct = service.getById("2");
            expect(existingProduct).not.toBeNull();

            const duplicate: Product = { id: "2", name: "modified", quantity: 100, price: 999 };
            const result = service.create(duplicate);

            expect(result).toBeNull();
            expect(service.getById("2")?.name).toBe("apple");
        });
    });

    describe("update", () => {
        it("should update product name", () => {
            const updated = service.update("1", { name: "yellow banana" });

            expect(updated).not.toBeNull();
            expect(updated?.name).toBe("yellow banana");
            expect(updated?.quantity).toBe(10);
            expect(updated?.price).toBe(15);
        });

        it("should update product quantity", () => {
            const updated = service.update("1", { quantity: 25 });

            expect(updated?.quantity).toBe(25);
            expect(updated?.name).toBe("banana");
        });

        it("should update multiple fields", () => {
            const updated = service.update("2", { name: "red apple", quantity: 15, price: 25 });

            expect(updated?.name).toBe("red apple");
            expect(updated?.quantity).toBe(15);
            expect(updated?.price).toBe(25);
        });

        it("should return null for non-existent product", () => {
            const updated = service.update("999", { name: "ghost" });

            expect(updated).toBeNull();
        });

        it("should handle partial updates", () => {
            const updated = service.update("1", { price: 18 });

            expect(updated?.price).toBe(18);
            expect(updated?.name).toBe("banana");
            expect(updated?.quantity).toBe(10);
        });
    });

    describe("delete", () => {
        it("should delete a product by id", () => {
            const deleted = service.delete("1");

            expect(deleted).not.toBeNull();
            expect(deleted?.id).toBe("1");
            expect(deleted?.name).toBe("banana");
        });

        it("should remove product from list", () => {
            service.delete("1");

            expect(service.getById("1")).toBeNull();
            expect(service.getAll()).toHaveLength(1);
        });

        it("should return null for non-existent product", () => {
            const deleted = service.delete("999");

            expect(deleted).toBeNull();
            expect(service.getAll()).toHaveLength(2);
        });

        it("should delete only the specified product", () => {
            service.delete("1");

            expect(service.getById("1")).toBeNull();
            expect(service.getById("2")).not.toBeNull();
            expect(service.getById("2")?.name).toBe("apple");
        });
    });

    describe("integration tests", () => {
        it("should handle create and delete cycle", () => {
            const newProduct: Product = { id: "10", name: "test", quantity: 5, price: 10 };
            const created = service.create(newProduct);

            expect(created).not.toBeNull();

            const deleted = service.delete("10");
            expect(deleted?.id).toBe("10");
            expect(service.getById("10")).toBeNull();
        });

        it("should handle create, update, and retrieve", () => {
            const newProduct: Product = { id: "11", name: "mango", quantity: 7, price: 30 };
            service.create(newProduct);

            const updated = service.update("11", { quantity: 12, price: 35 });
            expect(updated?.quantity).toBe(12);
            expect(updated?.price).toBe(35);

            const retrieved = service.getById("11");
            expect(retrieved?.quantity).toBe(12);
            expect(retrieved?.price).toBe(35);
        });
    });
});
