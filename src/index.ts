import { fastify } from 'fastify';
//import { publish_sr_content } from './uploader';
import fs from "fs";
interface APIBody {
  url: string;
  title: string;
  content: string;
  desc: string;
  tags: string;
}

const server = fastify({ logger: true });

server.get('/', async (request, reply) => {
  console.log("hello!");
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
    /*response: {
      200: {
        type: 'object',
        properties: {
          "status": { type: 'string' }
        }
      }
    }*/
  }
}

/*server.post("/publish", opts, async (request, reply) => {
  const data = <APIBody>request.body;
  publish_sr_content(
    "4e7863a07443979b1523e3a78b5251188815a5ada9b32bb6d3ec852e808d",
    data.title || "SimpreadArticle",
    data.content,
    (err, res) => {
      if (err != null) return { status: "failure" };
      console.log("res is:", res);
      return {
        status: "success",
        result: res
      }
    }
  );
});
*/
const start = async () => {
  try {
    await server.listen(17788);
    console.log('Server started successfully');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();

/*async function test() {
  await publish_sr_content("4e7863a07443979b1523e3a78b5251188815a5ada9b32bb6d3ec852e808d",
    "SimpreadArticle",
    fs.readFileSync("./src/sr-read-content.html", "utf-8"),
    (err, res) => {
      console.log("res is:", res);
      return {
        status: "success",
        result: res
      }
    }
  );
} */