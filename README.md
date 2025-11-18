EdTech Task Manager

A web application that helps teachers assign tasks and students track progress.
This project includes a React frontend and a Node.js Express backend with MongoDB.

Overview

The goal of this project is to provide a simple task management system for education.
Both students and teachers log in using JWT authentication.
Each user sees different features based on their role.

Features
For Students

View tasks assigned by teachers
Update progress of each task
Add personal tasks for private use
See deadlines and task status clearly

For Teachers

Assign tasks to one student or multiple students
View student progress in real time
Edit and delete tasks when required
Monitor class performance and task completion

System Features

Role based access control
Secure authentication using JWT
Simple and clean UI for login, signup and dashboards
Integration with a MongoDB Atlas database

Project Structure

The project contains two main folders: client and server.

client folder

This contains all frontend code written in React.

src

api

api.js

Contains all API request functions using Axios.

assets
Contains images such as home-bg.jpg

pages
Login.jsx

Signup.jsx 

StudentDashboard.jsx

TeacherDashboard.jsx

AddTask.jsx

EditTask.jsx

Home.jsx

CSS files for styling each page

components
Nav.jsx

Navbar.css


App.js

Main file where all routes are set up.

index.js

Entry point of the React application.

server folder

This contains backend code using Node.js and Express.

controllers

authController.js

Handles signup and login logic

taskController.js

Handles creating, editing, assigning and deleting tasks

middleware

auth.js

Checks if JWT token is valid before allowing access

errorHandler.js

Handles errors from backend routes

models

User.js

Defines user schema including name, email, password and role

Task.js

Defines task schema including title, description, assignedTo and status

routes

auth.js

Routes for signup and login

tasks.js

Routes for task creation, editing, deleting and fetching

index.js

Connects all route files together

Tech Stack

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

Setup Instructions
1. Install Dependencies

Frontend
cd client
npm install

Backend
cd server
npm install

2. Add Environment Variables

Inside the server folder create a file named .env and add the following:

MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key

MONGO_URI connects your backend to your database.
JWT_SECRET protects your login tokens.

3. Run the Application

Start the backend
cd server
npm run dev

Start the frontend
cd client
npm start

4. Open the application

After running both servers open a browser and go to:

http://localhost:3000

The frontend will load and connect to the backend automatically.

AI Disclaimer:

AI helped with deployment and implementation of the backend. Also helped with javascript code snippets which i couldn't write and know about. Helped with few layouts.
