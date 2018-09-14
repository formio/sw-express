import NodeRequest from './request';
import NodeResponse from './response';
const Router = require('express/lib/router');

export default function(options = {}) {
  const app = new Router(options);

  console.log('initializing router');
  app.getOption = (name) => {
    if (options.hasOwnProperty(name)) {
      return options[name];
    }
    return '';
  };

  app.listen = (host) => {
    app.host = host;

    self.addEventListener('fetch', (event: any) => {
      // If the request is not to our host, respond as normal.
      if (!event.request.url.startsWith(host)) {
        event.respondWith(fetch(event.request).then(response => {
          return response;
        }));
        return;
      }

      event.respondWith(new Promise((resolve) => {
        const req = new NodeRequest(app, event.request);
        const res = new NodeResponse(app, resolve);

        req.res = res;
        res.req = req;

        // Handle query separately.
        const url = new URL(event.request.url);
        const searchParams: any = new URLSearchParams(url.search);
        req.query = {};
        for (const [key, value] of searchParams.entries()) {
          req.query[key] = value;
        }

        app.handle(req, res, () => {
          console.log(event.request.url, 'Request finished with no handlers');
        });
      }));
    });
  };

  return app;
};
