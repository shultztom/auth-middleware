# auth-middleware

### Usage

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
    res.render("index", { title: "Hello World!" });
});
```

### Pre-requisites

1. Must have account registered at `https://auth-api-go.shultzlab.com/`
   1. https://github.com/shultztom/auth-api-go