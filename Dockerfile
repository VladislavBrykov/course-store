FROM node:16-alpine3.11
RUN ls -al
WORKDIR /app

COPY --chown=node:node . ./
RUN chown -R node:node /app

ENV PATH /app/node_modules/.bin:$PATH

RUN yarn install --frozen-lockfile

RUN yarn build

USER node

CMD ["yarn", "start:prod"]
