import express, { Request, Response } from "express";

const app = express();
const port = 3000;

type Product = {
    id: string;
    name: string;
    quantity: number;
    price: number;
};

const availableProducts: Product[] = [
    {
        id: "1",
        name: "banana",
        quantity: 10,
        price: 15,
    },
    {
        id: "2",
        name: "apple",
        quantity: 10,
        price: 15,
    },
];

// Middleware
app.use(express.json());

// GET all products
app.get("/products", (req: Request, res: Response) => {
    res.json(availableProducts);
});

// GET product by ID
app.get("/products/:id", (req: Request, res: Response) => {
    const product = availableProducts.find((p) => p.id === req.params.id);
    if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
    }
    res.json(product);
});

// CREATE new product
app.post("/products", (req: Request, res: Response) => {
    const { id, name, quantity, price } = req.body;

    if (!id || !name || quantity === undefined || price === undefined) {
        res.status(400).json({ error: "Missing required fields: id, name, quantity, price" });
        return;
    }

    if (availableProducts.some((p) => p.id === id)) {
        res.status(409).json({ error: "Product with this ID already exists" });
        return;
    }

    const newProduct: Product = { id, name, quantity, price };
    availableProducts.push(newProduct);
    res.status(201).json(newProduct);
});

// UPDATE product by ID
app.put("/products/:id", (req: Request, res: Response) => {
    const product = availableProducts.find((p) => p.id === req.params.id);
    if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
    }

    const { name, quantity, price } = req.body;

    if (name !== undefined) product.name = name;
    if (quantity !== undefined) product.quantity = quantity;
    if (price !== undefined) product.price = price;

    res.json(product);
});

// DELETE product by ID
app.delete("/products/:id", (req: Request, res: Response) => {
    const index = availableProducts.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
        res.status(404).json({ error: "Product not found" });
        return;
    }

    const deletedProduct = availableProducts.splice(index, 1)[0];
    res.json(deletedProduct);
});

// Root endpoint
app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
