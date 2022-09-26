# auth-middleware

### Usage for verifyToken

```js
// import
const { verifyToken } = require("@shultztom/auth-middleware")
```

```js
// Use at app level
app.use(verifyToken);
```

```js
// Use at router level
router.get("/", verifyToken, function(req, res, next) {
    res.status(200).send('Hello World!');
});
```

### Usage for verifyTokenAndRole

```js
// import
const { verifyTokenAndRole } = require("@shultztom/auth-middleware")
```

```js
// Use at app level
app.use(verifyTokenAndRole("my-role"));
```

```js
// Use at router level
router.get("/", verifyToken("my-role"), function(req, res, next) {
   res.status(200).send('Hello World!');
});
```

### Pre-requisites

1. Must have account registered at `https://auth-api-go.shultzlab.com/`
   1. https://github.com/shultztom/auth-api-go