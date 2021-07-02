# node version
FROM node:14-alpine

# backend dir
WORKDIR /backend

# installing packages using yarn
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# copy rest of the files
COPY . .

# expose port
EXPOSE 3001

# run
CMD [ "yarn", 'dev' ]