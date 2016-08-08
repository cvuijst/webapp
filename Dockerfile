FROM node:slim
MAINTAINER Luis Herrera <08y83@boun.cr>
WORKDIR /app
RUN npm install redis
COPY webapp.js webapp.js
EXPOSE 8000
CMD ["node", "webapp.js"]
