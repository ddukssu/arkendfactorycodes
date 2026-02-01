# WuWa Build Guide — Assignment 3

This is a simple web application for managing character builds in the game **Wuthering Waves**. It allows users to create, view, and delete builds using a **Node.js** backend and **MongoDB** database.

## Project Description

This project was created for Web Technology 2 course. It demonstrates a full-stack CRUD application.

* **Topic:** Character builds for Wuthering Waves (WuWa).
* **Tech Stack:** Node.js, Express, MongoDB (Mongoose), and Bootstrap for the front-end.

## Features

* **Create:** Add a new character build (name, weapon type, echo set).
* **Read:** See the list of all saved builds from the database.
* **Delete:** Remove a build from the list.
* **Validation:** All fields are required to save data.
* **Timestamps:** The database automatically saves when a build was created.

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| **GET** | `/builds` | Get all builds |
| **POST** | `/builds` | Create a new build |
| **DELETE** | `/builds/:id` | Delete a build by ID |

## How to Run

1. Clone the repository:
```bash
git clone https://github.com/твой-логин/название-репозитория.git

```


2. Install dependencies:
```bash
npm install

```


3. Make sure your **MongoDB** is running.
4. Start the server:
```bash
node server.js

```


5. Open `http://localhost:3000` in your browser.

## GitHub Link

[My GitHub Repository](https://ddukssu.github.io/backendas3/)