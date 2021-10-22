FROM node:14

WORKDIR /app

COPY package.json .
COPY . ./

ARG NODE_ENV

RUN if [ "$NODE_ENV" = "dev" ]; \
            then npm install;   \
            else npm install --only=prod; \
            fi
RUN npm run lint
RUN npm test

COPY ./docker-entrypoint.sh /docker-entrypoint.sh

RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["npm", "run", "dev"]

EXPOSE $3000
