# Build stage
FROM node:22.16.0 AS build

## Declare build arguments
ARG COMMIT_SHA=""
ARG BUILD_TIME=""

## Declare environment variables
ENV NEXT_PUBLIC_BUILD_TIME=$BUILD_TIME
ENV NEXT_PUBLIC_COMMIT_SHA=$COMMIT_SHA

## Create app directory
WORKDIR /app

## Bundle app source
COPY . .

## Install app dependencies
RUN yarn

## Build app
RUN yarn build



# Run stage
FROM node:22.16.0

## Declare build arguments
ARG COMMIT_SHA=""
ARG BUILD_TIME=""

## Declare environment variables
ENV NEXT_PUBLIC_BUILD_TIME=$BUILD_TIME
ENV NEXT_PUBLIC_COMMIT_SHA=$COMMIT_SHA

## Switch to less privileged user
USER node

## Create app directory
WORKDIR /app

## Copy app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/package.json ./package.json

## Expose port
EXPOSE 3000

## Execute app
CMD ["npm", "start"]