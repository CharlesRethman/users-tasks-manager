FROM node:8.11-alpine
ADD . /users-tasks-manager
WORKDIR /users-tasks-manager
RUN npm install \
    && tsc
CMD ["npm, 'start']