The Dockerfile use nodejs binary that provide by alpine linux. 
Althrough it is not latest version of node, but is 8.1 is enough for me.


### Modify Dockerfile to suite your application, and build docker image by following command:


`
docker build . -t express-alpine
`


### To start the docker service, you can run it with command:


`
docker run --name my-express-app \
  -p 8130:8130 \
  -v `pwd`/app:/app \
  -t express-alpine:latest
`

