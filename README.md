# Arknights: Endfield Factory Hub

**Factory Protocol Management System**

A full-stack web application for managing, sharing, and optimizing factory layouts for the game Arknights: Endfield.

**Live Demo:** https://arknights-factory-hub.onrender.com

**Github repo:** https://github.com/ddukssu/arkendfactorycodes

## Description

This project allows players (Endministrators) to upload, browse, and filter factory blueprints. It serves as a community database to share efficient layouts for materials like Iron Ore, Copper Ingot, and AI Chips.

The application is built with a RESTful API architecture, utilizing ES6 Modules on the frontend for a clean, maintainable structure.

## Key Features

* **Authentication & Security:**
    * Secure JWT-based login and registration.
    * Role-Based Access Control (RBAC): Users can submit protocols; only Admins can approve or delete them.
    * Password hashing using bcryptjs.

* **Advanced CRUD Operations:**
    * Create: Users submit new blueprint layouts (pending approval).
    * Read: Dynamic gallery with search and filtering.
    * Update/Delete: Admin dashboard to moderate content.

* **Smart Filtering:**
    * Energy Cap Filter: Server-side filtering using MongoDB operators to find layouts under specific energy limits.
    * Material Search: Filter by output resource (e.g., "Iron Ore").
    * Live Search: Real-time title search.

* **Modern Frontend:**
    * Built with Bootstrap 5 and custom CSS for a sci-fi/industrial aesthetic.
    * Modular Architecture: Frontend logic split into ES Modules (auth.js, pages/, config.js).

## Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES Modules), Bootstrap 5
* **Deployment:** Render (Integrated Frontend)

## Installation & Setup

To run this project locally:

1. Clone the repository
```bash
git clone [https://github.com/ddukssu/arkendfactorycodes.git](https://github.com/ddukssu/arkendfactorycodes.git)
cd arkendfactorycodes
```

2. Install dependencies
```bash
npm install

```


3. Configure Environment Variables
   Create a .env file in the root directory and add your keys:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here

```


4. Run the application
```bash
npm start

```


The server will start at http://localhost:3000.

## API Documentation

### Auth

* POST /api/auth/register - Create a new user.
* POST /api/auth/login - Login and receive JWT token.

### Templates (Public)

* GET /api/templates - Get all approved protocols.
* GET /api/templates?maxEnergy=50 - Filter by energy consumption.
* GET /api/templates?search=Iron - Search by title.
* GET /api/templates/:id - Get details of a specific protocol.

### Submissions (Protected)

* POST /api/submissions - Submit a new protocol (Requires Token).
* GET /api/submissions - View pending submissions (Admin only).
* PUT /api/submissions/:id/approve - Approve & Publish (Admin only).
* PUT /api/submissions/:id/reject - Delete submission (Admin only).

> **Note:** A Postman collection (`Endfield_API.postman_collection.json`) is included in the root directory for testing purposes.

## Disclaimer

This is a non-profit fan project created for educational purposes.
Arknights: Endfield content and materials are trademarks and copyrights of Hypergryph / Gryphline.

---

Author: Nazarbek Aizada (SE-2433)
