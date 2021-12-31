import { fastify } from 'fastify';
import { publish_sr_content } from './uploader';

interface APIBody{
  url: string;
  title: string;
  content: string;
  desc: string;
  tags: string;
}

const server = fastify({logger: true});

server.get('/', async (request, reply) => {
  return { hello: 'world' };
});

const opts = {
  schema: {
    body: {
      type: 'object',
      properties: {
        url: { type: 'string' },
        title: { type: 'string' },
        desc: { type: 'string' },
        tags: { type: 'string' },
        content: { type: 'string' },
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          "status": { type: 'string' }
        }
      }
    }
  }
}

server.post("/publish", opts, async (request, reply) => {
  const data = <APIBody> request.body;
  const obj = 
  await publish_sr_content(
    "4e7863a07443979b1523e3a78b5251188815a5ada9b32bb6d3ec852e808d",
    data.title || "SimpreadArticle",
    data.content,
    (err, res) => {
      console.log("res is:", res);
      return {
        status: "success",
      }
    }
  );
});

const start = async () => {
  try {
      await server.listen(7784);
      console.log('Server started successfully');
  } catch (err) {
      server.log.error(err);
      process.exit(1);
  }
};
start();