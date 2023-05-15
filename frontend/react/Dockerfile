FROM node:16-alpine

EXPOSE 3000

RUN mkdir -p /app/node_modules
RUN mkdir -p /home/node

# Install python/pip
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

# This needs to happen *before* npm install
WORKDIR /home/node

RUN apk add --no-cache --virtual .gyp \
        make \
        g++ \
    && npm install --save-dev webpack@4.19.1 webpack-cli@3.1.1 webpack-dev-server@3.1.8 \
    && npm install --save-dev @babel/core@7.1.0 @babel/cli@7.1.0 \
    && npm install --save-dev @babel/preset-env@7.1.0 @babel/preset-react@7.0.0 \
    && npm install --save-dev @babel/plugin-proposal-class-properties \
    && npm install --save-dev style-loader@0.23.0 css-loader@1.0.0 babel-loader@8.0.2 \
    && npm install --save-dev react@17.0.0 react-dom@17.0.0 react-hot-loader@4.13.0 \
    && npm install react-router-dom@6.3.0 \
    && npm install --save-dev source-map-loader@1.0.0 \
    && npm install --save-dev @mui/material @emotion/react @emotion/styled \
    && apk del .gyp

# This needs to happen *after* npm install
USER node

RUN mkdir -p /home/node/app
RUN mkdir -p /home/node/app/src
WORKDIR /home/node/app

COPY . .

CMD [ "npm", "run", "start" ]