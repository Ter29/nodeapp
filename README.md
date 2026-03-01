# Product Management API

A TypeScript-based Node.js REST API for managing products with full CRUD operations, logging, and comprehensive test coverage.

## Features

- ✅ **CRUD Operations** - Create, Read, Update, Delete products
- 📝 **Logging** - Winston logger and Morgan HTTP request logging
- 🧪 **Testing** - Jest test suite with 19 tests (100% passing)
- 📦 **Type Safety** - Fully typed TypeScript implementation
- 🏗️ **Service Layer** - Separated business logic with `ProductService` class
- 🔍 **Error Handling** - Proper HTTP status codes and error messages

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **Language**: TypeScript 5.9.3
- **Logging**: Winston & Morgan
- **Testing**: Jest & ts-jest
- **Development**: ts-node-dev

## Installation

```bash
# Install dependencies
npm install
```

## Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

Server starts on `http://localhost:3000`

### Build

```bash
npm run build
```

### Build in Watch Mode

```bash
npm run build:watch
```

### Start Production Build

```bash
npm start
```

## API Endpoints

### Get All Products

```
GET /products
```

Returns all available products.

**Response:**

```json
[
    {
        "id": "1",
        "name": "banana",
        "quantity": 10,
        "price": 15
    }
]
```

### Get Product by ID

```
GET /products/:id
```

Returns a specific product by ID.

**Response:**

```json
{
    "id": "1",
    "name": "banana",
    "quantity": 10,
    "price": 15
}
```

**Error (404):**

```json
{ "error": "Product not found" }
```

### Create Product

```
POST /products
Content-Type: application/json
```

**Request Body:**

```json
{
    "id": "3",
    "name": "orange",
    "quantity": 8,
    "price": 12
}
```

**Response (201):**

```json
{
    "id": "3",
    "name": "orange",
    "quantity": 8,
    "price": 12
}
```

**Error (400):** Missing required fields

```json
{ "error": "Missing required fields: id, name, quantity, price" }
```

**Error (409):** Product already exists

```json
{ "error": "Product with this ID already exists" }
```

### Update Product

```
PUT /products/:id
Content-Type: application/json
```

**Request Body (all fields optional):**

```json
{
    "name": "yellow banana",
    "quantity": 20,
    "price": 18
}
```

**Response:**

```json
{
    "id": "1",
    "name": "yellow banana",
    "quantity": 20,
    "price": 18
}
```

**Error (404):**

```json
{ "error": "Product not found" }
```

### Delete Product

```
DELETE /products/:id
```

**Response:**

```json
{
    "id": "1",
    "name": "banana",
    "quantity": 10,
    "price": 15
}
```

**Error (404):**

```json
{ "error": "Product not found" }
```

## Testing

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Generate Coverage Report

```bash
npm run test:coverage
```

### Test Coverage

The test suite includes 19 tests covering:

- ✅ Get all products
- ✅ Get product by ID
- ✅ Create product (with duplicate detection)
- ✅ Update product (partial & full updates)
- ✅ Delete product
- ✅ Integration tests (multi-operation workflows)

## Project Structure

```
nodeapp/
├── src/
│   ├── index.ts                 # Express app setup & API routes
│   ├── ProductService.ts        # Business logic for product operations
│   └── ProductService.test.ts   # Jest test suite
├── dist/                        # Compiled JavaScript (generated)
├── logs/                        # Application logs (generated)
├── package.json                 # Dependencies & scripts
├── tsconfig.json               # TypeScript configuration
├── jest.config.js              # Jest configuration
└── README.md                   # This file
```

## Code Architecture

### ProductService Class

Handles all product array manipulation with methods:

- `getAll()` - Returns all products
- `getById(id)` - Returns product or null
- `create(product)` - Creates new product or null if duplicate
- `update(id, updates)` - Updates product fields or null if not found
- `delete(id)` - Removes and returns product or null if not found

### Express Routes

Routes use typed request parameters (`Request<IdParam>`) to ensure type safety and delegate to `ProductService` methods.

### Logging

- **Winston**: File and console logging with timestamps
- **Morgan**: HTTP request logging integrated with Winston
- **Log File**: `logs/app.log`

## Example Usage with cURL

```bash
# Get all products
curl http://localhost:3000/products

# Create a product
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"id":"3","name":"orange","quantity":8,"price":12}'

# Get single product
curl http://localhost:3000/products/1

# Update product
curl -X PUT http://localhost:3000/products/1 \
  -H "Content-Type: application/json" \
  -d '{"quantity":20}'

# Delete product
curl -X DELETE http://localhost:3000/products/1
```

## REST Client Extension

Use the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) VS Code extension to test APIs directly in your editor.

Create a file `requests.http` in your project root:

```http
### Get all products
GET http://localhost:3000/products

### Get product by ID
GET http://localhost:3000/products/1

### Create product
POST http://localhost:3000/products
Content-Type: application/json

{
  "id": "3",
  "name": "orange",
  "quantity": 8,
  "price": 12
}

### Update product
PUT http://localhost:3000/products/1
Content-Type: application/json

{
  "name": "yellow banana",
  "quantity": 20,
  "price": 18
}

### Delete product
DELETE http://localhost:3000/products/1

### Create another product
POST http://localhost:3000/products
Content-Type: application/json

{
  "id": "4",
  "name": "grape",
  "quantity": 15,
  "price": 25
}

### Get all products again
GET http://localhost:3000/products
```

**How to use:**

1. Install the [REST Client extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
2. Create a `requests.http` file in your workspace
3. Click "Send Request" above each request or press `Ctrl+Alt+R` (Windows) / `Cmd+Alt+R` (Mac)
4. View responses in the side panel

## Scripts Reference

| Script                  | Purpose                            |
| ----------------------- | ---------------------------------- |
| `npm run dev`           | Start dev server with auto-reload  |
| `npm run build`         | Compile TypeScript to JavaScript   |
| `npm run build:watch`   | Watch TypeScript files and rebuild |
| `npm start`             | Run production build               |
| `npm test`              | Run Jest tests                     |
| `npm run test:watch`    | Run tests in watch mode            |
| `npm run test:coverage` | Generate test coverage report      |
| `npm run format`        | Format code with Prettier          |
| `npm run format:check`  | Check code formatting              |

## Initial Data

The API comes with two sample products:

```json
[
    { "id": "1", "name": "banana", "quantity": 10, "price": 15 },
    { "id": "2", "name": "apple", "quantity": 10, "price": 15 }
]
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200 OK` - Successful GET/PUT/DELETE
- `201 Created` - Successful POST
- `400 Bad Request` - Missing or invalid fields
- `404 Not Found` - Product not found
- `409 Conflict` - Product ID already exists

## Development Notes

- All code is TypeScript with strict type checking
- Express routes use generic typing for path parameters
- ProductService methods return `null` instead of throwing errors for cleaner handling
- Request/response bodies are validated before service calls
- Logging captures all important operations

## Future Enhancements

- Database integration (MongoDB, PostgreSQL)
- Authentication & authorization
- Input validation middleware
- Pagination for product lists
- Product categories/filtering
- Inventory management features

## License

ISC
