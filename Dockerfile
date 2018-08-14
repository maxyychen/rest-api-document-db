FROM alpine:latest
MAINTAINER Max Chen <maxyychen@gmail.com>

# application folder
ENV APP_DIR /app
ENV HOST 0.0.0.0
ENV SERVER_NAME mapi
ENV PORT 8139
ENV MONGODB_URL "mongodb://mongo-0.mongo,mongo-1.mongo,mongo-2.mongo:27017"

VOLUME [${APP_DIR}]
WORKDIR ${APP_DIR}


COPY app ${APP_DIR}
COPY entrypoint.sh /entrypoint.sh


# install require package 
RUN apk add --no-cache bash nodejs nodejs-npm \  
  && npm install yarn -g \
  && cd ${APP_DIR} \
  && yarn

# expose web server port
# only http, for ssl use reverse proxy
EXPOSE ${PORT}

# copy config files into filesystem
# exectute start up script
ENTRYPOINT ["/entrypoint.sh"]
