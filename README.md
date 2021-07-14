### To run the database locally

```docker
docker run --name sem5db -e POSTGRES_DB=ee5209 -e POSTGRES_USER=charukahs -e POSTGRES_PASSWORD=thisisasecretpassword -p 3002:5432 -d postgres
```

### To access the database

```docker
docker exec -it sem5db psql -U charukahs -d ee5209 -W
```
