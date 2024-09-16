# Stage 1: Build
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install -f
COPY . .
ARG VUE_APP_SERVER_URL
ENV VUE_APP_SERVER_URL $VUE_APP_SERVER_URL
RUN npm run build

# Stage 2: Production
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT [ "entrypoint.sh" ]
# CMD ["nginx", "-g", "daemon off;"]
