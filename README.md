//Start Server
Terminal: cd /MAIN_PROJECT/NodeJSDemo
command: Node server.js

---

//Start Database
MongoDBCompress

---

//Start tel port(to send SMS)
Terminal: cd /MAIN_PROJECT/Zerohedge store

command: telnet smtp.elasticemail.com 2525
// Or 587, 465 (depending on your preference)

---

Docker:
Terminal: cd /MAIN_PROJECT/Zerohedge store
Terminal: cd /MAIN_PROJECT/NodeJSDemo

Command: docker-compose up --build

1.  If Error: failed to solve: image "docker.io/library/main_project-backend:latest": already exists

Steps to Resolve the Issue:
command : docker images

Look for any images with the name main_project-backend

command: docker rmi main_project-backend:latest

2.  Clear Docker's Cache
    command: docker builder prune

3.  Force Docker to Rebuild the Image

4.  Check Your docker-compose.yml Configuration

5.  Remove Existing Containers

command: docker-compose down

---

Delete Running Containers:

1. List Running Containers:
   command: docker ps

2. Stop a Running Container:
   command: docker stop <container-id-or-name>

3. List All Containers (Running and Stopped):
   command: docker ps -a

4. Delete (Remove) a Container:
   command: docker rm <container-id-or-name>

To remove multiple containers at once:
command: docker rm <container-id-1> <container-id-2>

you can delete all stopped containers with:
command: docker container prune

---

Delete Docker Images

1. List Docker Images:
   command: docker images

2. Remove a Docker Image:
   command: docker rmi <image-id-or-name>

3. Force Remove an Image:
   command: docker rmi -f <image-id-or-name>

4. Delete All Unused Images:
   command: docker image prune -a

---

Delete Docker Volumes (Optional)

1. List Docker Volumes:
   command: docker volume ls

2. Remove a Specific Volume:
   command: docker volume rm <volume-name>

3. Remove All Unused Volumes:
   command: docker volume prune

---

Deploy your Docker images to Kubernetes

1. Apply all Deployment and Service:
   Termails:" cd /MAIN_PROJECT/k8s
   command:
   kubectl apply -f mongo-deployment.yml
   kubectl apply -f backend-deployment.yml
   kubectl apply -f frontend-deployment.yml

2. check the Status of Your Pods:
   command: kubectl get pods

3. Check the Services:
   command: kubectl get services

4. Port Forwarding for Local Access (if using Docker Desktop for local Kubernetes):
   command:
   kubectl port-forward service/frontend-service 8080:80
   kubectl port-forward service/backend-service 3001:3000
   kubectl port-forward service/mongo-service 27017:27017

---

Steps to Delete Resources in Kubernetes

1. Identify the Pod(s) Using the mongo:latest Image
   command: kubectl get pods

2. Delete the MongoDB Pod(s)
   command: kubectl delete pod <pod-name>

3. Check Pod Status Again
   command: kubectl get pods

4. Delete the MongoDB Deployment (Optional)
   command: kubectl delete deployment mongo-deployment

5. Delete the Image Locally (Docker)
   command: docker rmi mongo:latest
