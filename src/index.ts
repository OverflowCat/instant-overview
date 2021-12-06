//import * as MediaUploader from './media';

// import restify
import * as restify from 'restify';

// start get server on port 3324 which returns current timestamp
const server = restify.createServer();
server.get('/', (req: restify.Request, res: restify.Response, next: restify.Next) => {
  res.send(200, {
    timestamp: new Date().getTime()
  });
  return next();
});