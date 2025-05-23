# Project Setup Guide

This guide will walk you through setting up and running the application locally.

## Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- MySQL (v8 or higher)

## Installation Steps

1. **Install Dependencies**
   Run the following command to install the required npm packages:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Copy the `.env.example` file to create a `.env` file:
     ```bash
     cp .env.example .env
     ```
   - Open the `.env` file and update the database-related variables in the `DB` section with your MySQL credentials (e.g., `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).

3. **Set Up MySQL Database**
   - Create a new MySQL database using your preferred MySQL client or command line:
     ```sql
     CREATE DATABASE your_database_name;
     ```
   - Ensure the database name and credentials match those specified in the `.env` file.

4. **Run Database Migrations**
   Execute the following command to apply the database schema:
   ```bash
   npm run db:migrate
   ```

5. **Start the Server**
   Run the following command to start the application server:
   ```bash
   npm start
   ```
   The server should now be running, typically on `http://localhost:3000` (check your `.env` file or project configuration for the specific port).

## Troubleshooting
- Ensure MySQL is running and accessible.
- Verify that the `.env` file contains the correct database credentials.
- If migrations fail, check the error logs for details and ensure the database user has sufficient permissions.
- If the server fails to start, check the console output for errors and verify that the port is not in use.

## Generate Survey report
1. `Login`
- Go to login request from auth folder and sign in with your credentials.
<img width="1552" alt="Ảnh màn hình 2025-04-27 lúc 20 54 02" src="https://github.com/user-attachments/assets/6ded4d82-63f8-40d2-b427-4abcc2cd12a1" />

- There is already setup for store token.
<img width="1552" alt="Ảnh màn hình 2025-04-27 lúc 21 04 04" src="https://github.com/user-attachments/assets/4134849c-4c37-46c3-91c6-589b5aba8269" />

- To use the token has just stored on any request then move to Authorization tab and select `Bearer Token`, next assign `{{accessToken}}` variable to reuse.
<img width="1552" alt="Ảnh màn hình 2025-04-27 lúc 21 06 20" src="https://github.com/user-attachments/assets/0a8cf452-0e23-4da0-b231-b7ba18bde6e0" />

2. `Generate report`
- Go to `report folder` then access the `Generate Survey Report` request and click `send` button to generate report. Finally save response to file.
<img width="1552" alt="Ảnh màn hình 2025-04-27 lúc 20 58 30" src="https://github.com/user-attachments/assets/1c87f6b2-07c2-4391-bcdd-441ceb128f66" />
