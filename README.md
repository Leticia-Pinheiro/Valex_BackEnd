# projeto18-valex
A Typescript designed project to manage benefit cards among companies and employees


<p align="center">
  <img  src="https://cdn.iconscout.com/icon/free/png-256/credit-card-2650080-2196542.png">
</p>
<h1 align="center">
  Valex
</h1>
<div align="center">

  <h3>Built With</h3>

  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" height="30px"/>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" height="30px"/>
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" height="30px"/>  
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express.js&logoColor=white" height="30px"/>
  <!-- Badges source: https://dev.to/envoy_/150-badges-for-github-pnk -->
</div>

<br/>

# Description

Valex simulates an API that manages a benefit card, generally made available by companies to their employees.

</br>

## Features

-   Get the card balance and transactions
-   Create cards
-   Activate / Block / Unlock a card
-   Recharge a card
-   Make card payments

</br>

## API Reference

### Create a card


```http
POST /create
```

#### Request:
| Headers     | Type     | Description           |
| :---------- | :------- | :-------------------- |
| `x-api-key` | `string` | **Required**. api key |

####



| Body         | Type     | Description                              |
| :------------| :------- | :--------------------------------------- |
| `employeeId` | `integer`| **Required**. user Id                    |
| `typeCard`  | `string`| **Required**. type of card benefit  |

`Valid types: [groceries, restaurant, transport, education, health]`

####



</br>

#### Response:

```json
{
	"number": "1111 1111 1111 1111",
	"cardholderName": "NAME N NAME",
	"cardCvv": "111",
	"cardExpirationDate": "01/27",
	"type": "card type"    
}
```


#



### Activate a card

```http
PUT /activation
```

#### Request:

| Body             | Type     | Description                        |
| :--------------- | :------- | :--------------------------------- |
| `number`         | `string`| **Required**. card number              |
| `securityCode`   | `string` | **Required**. card cvv             |
| `password`       | `string` | **Required**. card password        |

`Password length: 4`

`Password pattern: only numbers`

`Cvv length: 3`

#

### Block a card

```http
PUT /block
```

#### Request:

| Body             | Type     | Description                        |
| :--------------- | :------- | :--------------------------------- |
| `number`         | `string`| **Required**. card number              |
| `password`       | `string` | **Required**. card password        |

#

### Unlock a card

```http
PUT /unlock
```

#### Request:

| Body             | Type     | Description                        |
| :--------------- | :------- | :--------------------------------- |
| `number`         | `string`| **Required**. card number              |
| `password`       | `string` | **Required**. card password        |

#

### Get card transactions

```http
GET /transactions
```

#### Request:

| Body      | Type      | Description           |
| :---------- | :-------- | :-------------------- |
| `cardId` | `integer` | **Required**. card Id |

#

### Recharge a card

```http
POST /createRecharge
```

#### Request:

| Headers     | Type     | Description           |
| :---------- | :------- | :-------------------- |
| `x-api-key` | `string` | **Required**. api key |

####

| Body             | Type      | Description                        |
| :--------------- | :-------- | :--------------------------------- |
| `number`         | `string` | **Required**. card number              |
| `amount`         | `integer` | **Required**. recharge amount      |

#

### Card payments

```http
POST /createPayment
```
#### Request:

| Body             | Type      | Description                        |
| :--------------- | :-------- | :--------------------------------- |
| `number`         | `string` | **Required**. card number              |
| `businessName`     | `string` | **Required**. business name |
| `password`       | `string`  | **Required**. card password        |
| `amount`         | `integer` | **Required**. payment amount       |

#



## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL = postgres://UserName:Password@Hostname:5432/DatabaseName`

`PORT = number #recommended:5000`

</br>

## Run Locally

Clone the project

```bash
  git clone https://github.com/Leticia-Pinheiro/Valex_BackEnd
```

Go to the project directory

```bash
  cd Valex_BackEnd/
```

Install dependencies

```bash
  npm install
```

Create database

```bash
  cd database/
```
```bash
  bash ./create-database
```
```bash
  cd ../
```

Start the server

```bash
  npm start
```

</br>

## Authors

Letícia Gomez Pinheiro 
<p>Linkedin: https://www.linkedin.com/in/leticia-pinheiro-33354a1b6/</p>
<p>GitHub: https://github.com/Leticia-Pinheiro</p>
<br/>

#