# Farmers Marketplace Backend API

This is the backend API for the Farmers Marketplace application, built with Express.js, TypeScript, and MongoDB.

## Features

- User authentication (JWT)
- Role-based access control (Farmer, Customer, Admin)
- Product management
- Order processing
- Real-time updates
- File upload support
- Error handling
- Input validation

## Prerequisites

- Node.js (v14+ recommended)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory and add your environment variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/farmers_marketplace
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=24h
   NODE_ENV=development
   ```

## Development

Start the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm start
```

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password

### Product Routes
- `POST /api/products` - Create new product (Farmer only)
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `PUT /api/products/:id` - Update product (Owner or Admin)
- `DELETE /api/products/:id` - Delete product (Owner or Admin)
- `GET /api/products/farmer/:id` - Get farmer's products
- `PUT /api/products/:id/availability` - Update product availability

### Order Routes
- `POST /api/orders` - Create new order (Customer only)
- `GET /api/orders` - Get all orders (filtered by user role)
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (Farmer or Admin)
- `PUT /api/orders/:id/payment` - Update payment status (Admin only)
- `PUT /api/orders/:id/cancel` - Cancel order (Customer or Admin)

## Project Structure

```
src/
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/         # Mongoose models
├── routes/         # Route definitions
├── utils/          # Utility functions
└── server.ts       # Entry point
```

## Error Handling

The API uses a custom error handling middleware that processes:
- Validation errors
- Authentication errors
- Not found errors
- Duplicate key errors
- General server errors

## Security

- JWT authentication
- Password hashing
- CORS configuration
- Input sanitization
- Rate limiting
- Secure HTTP headers

## Data Models

### User
- email
- password
- name
- role (farmer/customer/admin)
- phone
- address
- profileImage

### Product
- name
- description
- price
- quantity
- unit
- category
- images
- farmer (ref: User)
- isAvailable
- location
- harvestedDate
- expiryDate

### Order
- customer (ref: User)
- farmer (ref: User)
- items (Array of products)
- totalAmount
- status
- paymentStatus
- paymentMethod
- deliveryAddress
- deliveryInstructions
- expectedDeliveryDate
- actualDeliveryDate

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request