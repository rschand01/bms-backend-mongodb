# Blog Management System (BMS) - Backend (MongoDB)

This project is a fully-featured Blog Management System (BMS) backend built with **Node.js, Express, MongoDB, and Redis.** It includes user authentication, blog creation and management, profile updates, user connections, and caching using Redis.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication (signup, signin, logout)
- Account verification and deletion
- Password reset and update
- Profile view and update
- Blog creation, update, deletion, and view
- Feed view for blogs
- User Connections (Follow/Unfollow)
- CSRF protection
- Redis caching for blog data
- Rate limiting and file upload middleware
- Json Web Token (JWT) for protected routes and token validation
- JOI for error handling
- Nodemailer for email marketing & messaging
- Pug for generating email templates
- Winston for logging

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/rschand-dev/bms-backend-mongodb.git
   cd bms-backend
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and configure the following variables:

   ```env
   # Example: EXPRESS_PORT=3001
   EXPRESS_PORT=PORT_NUMBER

   # Example: WINSTON_SERVICE="bms-backend-mongodb"
   WINSTON_SERVICE=SERVICE_NAME

   # Example: NODE_ENV=development
   # Example: NODE_ENV=production
   NODE_ENV=ENVIRONMENT

   # Example: MONGO_DB_URI=mongodb://localhost:27017/BlogManagementSystem
   # * Replace mongodb://localhost:27017/BlogManagementSystem with your MongoDB Atlas URI to connect to Atlas.
   MONGO_DB_URI=MONGO_DB_URI_STRING

   # Example: REDIS_CLIENT_PASSWORD=enteryourredispasswordhere
   REDIS_CLIENT_PASSWORD=PASSWORD

   # Example: REDIS_CLIENT_HOST=enteryourredishosthere
   REDIS_CLIENT_HOST=HOST

   # Example: REDIS_CLIENT_PORT=30982
   REDIS_CLIENT_PORT=PORT_NUMBER

   # Example: EXPRESS_SESSION_SECRET=secretKey
   EXPRESS_SESSION_SECRET=SECRET_KEY

   # Example: COOKIE_SESSION_SECRET=secretKey
   COOKIE_SESSION_SECRET=SECRET_KEY

   # Example: CORS_ORIGIN=http://localhost:3001
   CORS_ORIGIN=ALLOWED_ORIGIN

   # Example: COMPANY_EMAIL="example@example.com"
   COMPANY_EMAIL=EMAIL

   # Example: COMPANY_EMAIL_PASSWORD="enteryouremailaccountpassword"
   COMPANY_EMAIL_PASSWORD=PASSWORD

   # Example: COMPANY_NAME="My Company"
   COMPANY_NAME=NAME

   # Example: WEBSITE_URL="http://localhost:5000/account-verification"
   WEBSITE_URL=URL

   # Example: JWT_SECRET_KEY=secretKey
   JWT_SECRET_KEY=SECRET_KEY
   ```

4. **Setup Docker**

   ```bash
   sudo docker pull mongo
   ```

   ```bash
   sudo docker run -d --name mongodb -p 27017:27017 mongo
   ```

5. **Start the server:**

   ```bash
   pnpm start
   ```

## Configuration

The project uses environment variables for configuration. Refer to the [`.env.example`](.env.example) file for the required variables. Make sure to set these variables in your `.env` file.

## Usage

### Starting the Server

To start the server in development mode:

```bash
pnpm serve
```

If all goes well, then you should have something similar in your terminal. Refer Below:

```bash
> bms-backend-mongodb@1.0.0 preserve C:\Users\rschand\Projects\Project List\bms-backend-mongodb
> npx eslint .


> bms-backend-mongodb@1.0.0 serve C:\Users\rschand\Projects\Project List\bms-backend-mongodb
> nodemon ./server.mjs

[nodemon] 3.1.4
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node ./server.mjs`
info: Express Server is successfully listening! {"additional":"port: 3001","timestamp":"2024-07-26 01:03:14"}
info: Connection to MongoDB database have been established! {"timestamp":"2024-07-26 01:03:14"}
info: Connection to Redis Data Store have been established! {"additional":"port: 19314","timestamp":"2024-07-26 01:03:15"}
```

## API Documentation

Use a tool like Postman, Thunder Client extension in Visual Studio Code or Insomnia to test the API endpoints. Refer to the API Endpoints section for a list of available routes.

## Project Structure

Please click on [PROJECT_STRUCTURE](PROJECT_STRUCTURE) to view the project structure.

Alternatively you can find the `PROJECT_STRUCTURE` file in the root directory of this repository and or project folder.

## API Endpoints

### Authentication

- **POST** /auth/signup - User signup
- **POST** /auth/signin - User signin
- **POST** /auth/logout - User logout (requires JWT)
- **DELETE** /auth/account-deletion - Delete account (requires JWT)
- **POST** /auth/password-reset-email - Send password reset email
- **PUT** /auth/account-verification - Verify account (requires token)
- **PUT** /auth/password-update - Update password (requires JWT)
- **PUT** /auth/password-reset - Reset password (requires token)

### User Profile

- **GET** /user/profile - View user profile (requires JWT)
- **PUT** /user/profile-update - Update user profile (requires JWT)

### User Connection

- **PUT** /user/social/operation - Create and or Update User Connections (Follow/Unfollow) (requires JWT)

### Blog

- **GET** /blog/feeds - View blog feeds (requires JWT)
- **GET** /blog/:blogSlug - View specific blog (requires JWT, with blogSlug as the parameter)

---

- **POST** /:userName/blog/create - Create a new blog (requires JWT, with userName as the parameter)
- **PUT** /:userName/blog/:blogSlug/update - Update a blog (requires JWT, with userName as the parameter)
- **DELETE** /:userName/blog/:blogSlug/delete - Delete a blog (requires JWT, with userName as the parameter)

### Redis Cache

- **POST** /invalidate/redis/cache/blog/keys - Invalidate Redis cache for blog keys (requires JWT)

### CSRF

- **GET** /csrf - Get CSRF token

**NOTE**

- Token will be made available in the headers as **csrf.**
- Pass \_csrf: `token` as a field in all HTTP request except GET.

**EXAMPLE**

```json
{
  "_csrf": "sLcvXE5CdwMCPJhRoill8TUKNqeZHkQd5TW1Q=",
  "firstName": "Reginald",
  "lastName": "Chand",
  "userName": "reginaldchand",
  "email": "hy.rschand@gmail.com",
  "password": "#@%4Actbvus&&8eflekdfdt53n##",
  "confirmPassword": "#@%4Actbvus&&8eflekdfdt53n##"
}
```

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch (git checkout -b feature-branch)
3. Make your changes
4. Commit your changes (git commit -m 'Add some feature')
5. Push to the branch (git push origin feature-branch)
6. Open a pull request

## License

This project is licensed under the [`GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007`](LICENSE)

See the [License](LICENSE) for details.

## Copyright

© 2024 [Reginald Chand](https://github.com/rschand-dev). All rights reserved.

**Repository:** [`bms-backend-mongodb`](https://github.com/rschand-dev/bms-backend-mongodb)

---

Designed & Developed with 😍 💝🌺

**Kind Regards**

Reginald Chand
