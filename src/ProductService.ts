export type Product = {
    id: string;
    name: string;
    quantity: number;
    price: number;
};

export class ProductService {
    private products: Product[];

    constructor(initialProducts: Product[] = []) {
        // make a shallow copy so callers can't mutate our internal array
        this.products = [...initialProducts];
    }

    getAll(): Product[] {
        return this.products;
    }

    getById(id: string): Product | null {
        return this.products.find((p) => p.id === id) || null;
    }

    create(product: Product): Product | null {
        if (this.getById(product.id)) {
            return null; // signal that product already exists
        }
        this.products.push(product);
        return product;
    }

    update(id: string, updates: Partial<Omit<Product, "id">>): Product | null {
        const existing = this.getById(id);
        if (!existing) {
            return null;
        }
        if (updates.name !== undefined) existing.name = updates.name;
        if (updates.quantity !== undefined) existing.quantity = updates.quantity;
        if (updates.price !== undefined) existing.price = updates.price;
        return existing;
    }

    delete(id: string): Product | null {
        const index = this.products.findIndex((p) => p.id === id);
        if (index === -1) {
            return null;
        }
        const [removed] = this.products.splice(index, 1);
        return removed;
    }
}
