# Running With Docker
1. Install Docker  
    >https://www.docker.com/get-started
2. From the ./api directory, build the API container
    >docker build . --tag team418
3. Run the API container
    >docker run -p 127.0.0.1:5000:5000/tcp team418 npm start
4. Access the API normally
    >http://localhost:5000