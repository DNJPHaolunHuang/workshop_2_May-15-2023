# Install

```
npm install
```

# Running the Demo app

```
npm run start
```

This will run the app on `http://localhost:8081/index`, where you can access the Swagger APIs.

# Create DID

Generate DID & Polygon wallet.

![Create DID](./img/Create%20polygon%20DID.png)

# Get Test Tokens

Get test token from [faucet.polygon](https://faucet.polygon.technology/) for the gas fee with the wallect address from the create did output.
![faucet.polygon](./img/faucet.polygon.png)

# Register DID

After the Test Tokens transfer to wallect, DID could be published with the information according to the create did output.

![Register DID](./img/Register%20polygon%20DID.png)

# Update DID

DID document with mock vehicele informaiton could be attached on the published DID.

![Update DID](./img/Update%20polygon%20DID.png)

# Query result by polygonscan

The execution result is reflected on the [polygonscan](https://mumbai.polygonscan.com/)\
Filter with the wallect address from create did output.
![Query ](./img/Query%20operation%20by%20Address%20.png)
