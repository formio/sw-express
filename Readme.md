# Express Service Worker

Extend express to run as a service worker in the browser

## Install

```bash
npm install sw-express
```

## Use

```javascript
import { express } from 'sw-express';

const app = express();

// This is a custom body parser for fetch requests.
app.use((req, res, next) => {
  req.request.text().then(text => {
    if (text) {
      // Attempt to convert to an object if it is json. Otherwise return the text.
      try {
        req.body = JSON.parse(text);
      }
      catch (err) {
        req.body = text;
      }
    }
    next();
  });
});

app.use((req, res, next) => {
  // Write your own middleware as usual.
  next();
});

// Handle errors
app.use((err, req, res, next) => {
  if (err) {
    console.error(err);
  }
  next();
});

// Listen to a URL, not a port. This will intercept any requests made to this url.
app.listen('http://myserver.com');
```


