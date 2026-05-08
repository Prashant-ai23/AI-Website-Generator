# API Documentation

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://api.example.com`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register
- **POST** `/api/auth/register`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword",
    "name": "User Name"
  }
  ```
- **Response**:
  ```json
  {
    "message": "User registered successfully",
    "token": "jwt-token",
    "user": {
      "id": "userId",
      "email": "user@example.com",
      "name": "User Name"
    }
  }
  ```

#### Login
- **POST** `/api/auth/login`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Response**: Same as register

#### Get Current User
- **GET** `/api/auth/me`
- **Auth**: Required
- **Response**:
  ```json
  {
    "id": "userId",
    "email": "user@example.com",
    "name": "User Name",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
  ```

### Websites

#### List Websites
- **GET** `/api/websites`
- **Auth**: Required
- **Response**:
  ```json
  [
    {
      "_id": "websiteId",
      "title": "My Website",
      "description": "Description",
      "userId": "userId",
      "theme": "default",
      "isPublished": false,
      "content": {},
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
  ```

#### Get Website
- **GET** `/api/websites/:id`
- **Auth**: Required
- **Response**: Single website object

#### Create Website
- **POST** `/api/websites`
- **Auth**: Required
- **Body**:
  ```json
  {
    "title": "My Website",
    "description": "Description",
    "theme": "default",
    "content": {}
  }
  ```
- **Response**: Created website object

#### Update Website
- **PUT** `/api/websites/:id`
- **Auth**: Required
- **Body**: Partial website object
- **Response**: Updated website object

#### Delete Website
- **DELETE** `/api/websites/:id`
- **Auth**: Required
- **Response**:
  ```json
  {
    "message": "Website deleted"
  }
  ```

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "message": "Error message",
    "statusCode": 400,
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

### Status Codes

- `200`: OK
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `409`: Conflict (e.g., email already registered)
- `500`: Internal Server Error

## Rate Limiting

Currently not implemented, but recommended for production.

## CORS

The API accepts requests from configured origins. Update `FRONTEND_URL` in backend `.env` to allow your frontend.
