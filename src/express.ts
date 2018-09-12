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
      console.log('request', event.request.url);
      // If the request is not to our host, respond as normal.
      if (!event.request.url.startsWith(host)) {
        event.respondWith(fetch(event.request).then(response => {
          return response;
        }));
        return;
      }

      console.log('handling', event.request.url);
      event.respondWith(new Promise((resolve) => {
        const req = new NodeRequest(app, event.request);

        const res = new NodeResponse(app, resolve);
        req.res = res;
        res.req = req;

        app.handle(req, res, () => {
          console.log('App finished with no handlers');
        });
      }));
    });
  };

  return app;
};
