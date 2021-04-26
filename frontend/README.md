# Running With Docker
1. Install Docker
    >https://www.docker.com/get-started
2. From the ./frontend directory, build the frontend container
    >docker build . --tag team418-frontend
3. Run the frontend container
    >docker run -p 127.0.0.1:3000:3000/tcp team418-frontend npm run dockerStart
4. Access the frontend normally
    >http://localhost:3000
