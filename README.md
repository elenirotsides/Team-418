# Team 418 Final Project

## Required Software
- MongoDB
- Node & npm
- Redis Server
## Additional Required Software
- ImageMagick
  - Download at:
    >https://imagemagick.org/script/download.php
  - Ensure you have the executable on your system path by executing this command
    > magick --version
- Docker & Docker-Compose
  - See instructions below

## Required Files
- googleInfo.json
    - Contains the required tokens to authenticate users with Google in the API
        > api/middleware/googleInfo.json
- .env
    - Contains the required tokens to authenticate users with Google in the frontend
        > frontend/.env

## Running the Application Manually
### Running the API
The API runs on port 5000, and expects Redis Server to be on port 6379 and MongoDB to be on port 27017.
1. Go to the root of the API folder
    > cd api/
2. Install the required npm packages
    > npm i
3. Start MongoDB
4. Start Redis Server on default port
    > redis-server
5. Seed the database
    > npm run seed
6. Start the API
    > npm start
### Running the Frontend
The frontend runs on port 3000.
1. Go to the root of the frontend folder
    > cd frontend/
2. Install the required npm packages
    > npm i
3. Start the React app
    > npm start
## Running With Docker
1. Install Docker  
    >https://www.docker.com/get-started
2. Install Docker Compose
    >https://docs.docker.com/compose/install/
3. From the root directory, build the Docker Compose system
    >docker-compose build
4. Run the Docker Compose system
    >docker-compose up
5. Access the application normally
    >http://localhost:3000
6. When finished, kill the system
    >ctrl+c
7. Remove the containers completely
    >docker-compose down
