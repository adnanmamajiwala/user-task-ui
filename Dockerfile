FROM node:latest AS compile-image
WORKDIR /opt/ng
COPY package*.json ./
ENV PATH="./node_modules/.bin:$PATH"
RUN npm install
COPY . .
RUN npm run build

FROM nginx
COPY --from=compile-image /opt/ng/dist/user-task-ui /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
