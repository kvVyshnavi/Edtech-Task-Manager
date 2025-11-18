# EdTech Task Manager

A simple task manager that helps teachers assign tasks and students track progress — built with a React client and a Node/Express server.

## Features
- Teacher: create task templates and assign tasks to students
- Student: view assigned tasks and update progress
- Authentication (signup/login)
- REST API with JWT-protected routes

## Tech stack
- Frontend: React
- Backend: Node.js, Express
- Database: MongoDB (or another supported DB)
- Auth: JWT

Here you go — a **clean, simple README.md** with **NO LINES**, **NO ASCII characters**, **no borders**, **no extra symbols**.
Just plain text and headings.
You can paste this directly into your project.
## Features

### For Students

* View class tasks assigned by the teacher
* Update task progress in real-time
* Add personal tasks
* Track deadlines easily

### For Teachers

* Assign tasks to an entire class
* Monitor each student's progress
* View detailed task performance
* Manage and edit tasks

### System Features

* Role based access control
* Secure JWT authentication
* Clean UI for login, signup, and dashboards
* MongoDB Atlas database integration

## Project Structure

client
public
src
api
assets
components
pages
styles
server
config
middleware
models
routes

## Tech Stack

Frontend
React
Axios
React Router DOM

Backend
Node.js
Express.js
MongoDB
Mongoose
JWT Authentication

## Setup Instructions

### 1. Install Dependencies

Frontend
cd client
npm install

Backend
cd server
npm install

### 2. Configure Environment Variables

Create a file named `.env` inside the server folder and add:

MONGO_URI=your_new_mongo_connection_string
JWT_SECRET=your_secret_key

### 3. Run the Project

Start backend
cd server
npm run dev

Start frontend
cd client
npm start

### 4. Open the App

Go to:
[http://localhost:3000](http://localhost:3000)





