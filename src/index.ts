import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import morgan from "morgan";
import winston from "winston";
import { ProductService, Product } from "./ProductService";

// create express app
const app = express();
const port = 3000;

// ensure logs directory exists
const logDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// configure Winston logger
const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf(
            ({ level, message, timestamp }) => `${timestamp} [${level.toUpperCase()}] ${message}`,
        ),
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "logs/app.log" }),
    ],
});

// Morgan will use winston for HTTP request logging
app.use(morgan("combined", { stream: { write: (msg) => logger.info(msg.trim()) } }));

// parameter interface used for routes that expect an :id path variable
interface IdParam {
    id: string;
}

// In-memory product store
const productService = new ProductService([
    { id: "1", name: "banana", quantity: 10, price: 15 },
    { id: "2", name: "apple", quantity: 10, price: 15 },
]);

// Middleware
app.use(express.json());

// route logging example
app.use((req, res, next) => {
    logger.info(`Incoming ${req.method} request to ${req.url}`);
    next();
});

// GET all products
app.get("/products", (req: Request, res: Response) => {
    res.json(productService.getAll());
});

// GET product by ID
app.get<IdParam>("/products/:id", (req: Request<IdParam>, res: Response) => {
    const product = productService.getById(req.params.id);
    if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
    }
    res.json(product);
});

// CREATE new product
app.post("/products", (req: Request, res: Response) => {
    const { id, name, quantity, price } = req.body;

    logger.info(`Creating product ${id}`);

    if (!id || !name || quantity === undefined || price === undefined) {
        res.status(400).json({ error: "Missing required fields: id, name, quantity, price" });
        return;
    }

    const newProduct: Product = { id, name, quantity, price };
    const created = productService.create(newProduct);
    if (!created) {
        // already exists
        res.status(409).json({ error: "Product with this ID already exists" });
        return;
    }
    res.status(201).json(created);
});

// UPDATE product by ID
app.put<IdParam>("/products/:id", (req: Request<IdParam>, res: Response) => {
    const { name, quantity, price } = req.body;

    logger.info(`Updating product ${req.params.id}`);

    const updated = productService.update(req.params.id, { name, quantity, price });
    if (!updated) {
        res.status(404).json({ error: "Product not found" });
        return;
    }
    res.json(updated);
});

// DELETE product by ID
app.delete<IdParam>("/products/:id", (req: Request<IdParam>, res: Response) => {
    logger.info(`Deleting product ${req.params.id}`);
    const deleted = productService.delete(req.params.id);
    if (!deleted) {
        res.status(404).json({ error: "Product not found" });
        return;
    }
    res.json(deleted);
});

// Root endpoint
app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
