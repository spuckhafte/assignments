# API

Use postman to edit these values, its easier as it provides a tabular structure :)

## CREATE (POST)
```
localhost:3000?name=TEST&job=FOO&country=911&phone=7502486561&address=BAR&city=CAKE&state=SNACK&pname=TEST2&pcountry=91&pphone=1234567891&prelation=brother&sname=TEST3&scountry=91&sphone=2134567810&srelation=mother
```

## COLLECT (GET)
```
localhost:3000?page=1&size=3

localhost:3000?name=Rahul
```

## UPDATE (POST)
```
localhost:3000/update?id=2&table=PE&pname=Akshay
```

## DELETE (POST)
```
localhost:3000/update?id=4&table=SE
```

## Tables: Users, PE, SE
*Users, primary_emergency, secondary_emergency*