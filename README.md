# EE5209 Project

> Final result of web application module, ee5209, uor-deie

## Introduction

This is a web application made using react + express js for a hospital ward to manage their patient data and ward data. By this application I have implemented

- Responsive user interface
- User sign in/up process
- Storing patients' data
- Storing patients' bedticket data
- Encrypting sensitive data (patient and bedticket data) using AES-256
- Storing / retrieving images

## Used frameworks / technologies

1. [Next js](https://nextjs.org/) : React based frontend framework
2. [Express js](https://expressjs.com/) : Nodejs web application framework
3. Node js
4. Typescript
5. Postgres : Primary database
6. Docker

## Directory Structure

```
.
|-- /backend              # express js backend
  |-- /controllers        # business logic
  |-- /database           # database sql files
  |-- /middleware         # express js custom middlewares
  |-- /routes             # backend routes
  └── /utils              # utilities

|-- /frontend             # next js frontend
  |-- /components         # UI components
  |-- /contexts           # react context files
  |-- /pages              # next js pages
  |-- /public             # public files
  |-- /styles             # css files
  └── /utils              # utilities

└── /types                # typescript definitions
```

## How to start an instance

1. `docker-compose up -d`
2. Visit `localhost:3000` from browser
