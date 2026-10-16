# Syntecxhub Profile Upload API

A REST API that extends user authentication with profile picture uploads, built with Node.js, Express, MongoDB, JWT and Multer.
Created as part of the Syntecxhub Back-End Development Internship (Week 2, Project 3).

## Features

- Signup and login with bcrypt password hashing and JWT
- Upload or update a profile picture (authenticated users only)
- File metadata (filename, path, url, mimetype, size) stored in the user document
- Delete profile picture (removes file from disk and metadata from DB)
- Serve the picture via a public URL endpoint
- File type validation (jpeg, png, webp) and 2MB size limit
- Old picture is automatically removed when updated

## Tech Stack

Node.js, Express, MongoDB + Mongoose, Multer, bcryptjs, jsonwebtoken, dotenv

## Getting Started

1. Clone the repo and run `npm install`
2. Create a `.env` file:

3. Run `npm run dev`

## API Endpoints

| Method | Endpoint                 | Auth   | Description                      |
|--------|--------------------------|--------|----------------------------------|
| POST   | /api/auth/signup         | No     | Register a new user              |
| POST   | /api/auth/login          | No     | Login and receive a JWT          |
| GET    | /api/users/me            | Bearer | Get profile with picture metadata|
| PUT    | /api/users/me/picture    | Bearer | Upload or update picture         |
| DELETE | /api/users/me/picture    | Bearer | Delete picture                   |
| GET    | /api/users/:id/picture   | No     | Serve the picture image          |

Upload: send `multipart/form-data` with the file under the field name `picture`.

## Status Codes

| Code | Meaning                                   |
|------|-------------------------------------------|
| 200  | Success                                   |
| 201  | User created                              |
| 400  | Validation error / invalid file type      |
| 401  | Missing, invalid or expired token         |
| 404  | Picture or route not found                |
| 409  | Username or email already exists          |
| 413  | File too large (max 2MB)                  |
| 500  | Server error                              |

## Screenshots

Screenshot 2026-10-16 142502.png
Screenshot 2026-10-16 142545.png
Screenshot 2026-10-16 142817.png
Screenshot 2026-10-16 143854.png
Screenshot 2026-10-16 145237.png

## Author

Amandi Wanniarachchi

