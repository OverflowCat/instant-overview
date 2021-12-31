import { fastify } from 'fastify';
import { publish_sr_content } from './uploader';
interface APIBody {
  url: string;
  title: string;
  content: string;
  desc: string;
  tags: string;
}

const server = fastify({ logger: true });

server.get('/', async (request, reply) => {
  return { "status": 'The server is running!' };
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
  }
}

server.post("/publish", opts, async (request, reply) => {
  const data = <APIBody>request.body;
  const res = await publish_sr_content(
    "4e7863a07443979b1523e3a78b5251188815a5ada9b32bb6d3ec852e808d",
    data.title || "SimpreadArticle",
    data.content
  );
  return {
    status: "success",
    result: res
  }
});

const start = async () => {
  try {
    await server.listen(7784, "0.0.0.0");
    console.log('Server started successfully');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();

/*
EXAMPLE REQUEST
{"desc":"测试","tags":"wechat, javascript","url":"https://mp.weixin.qq.com/s/hUaQOm6qvd7r5uBUa7tF-g","title":"JS 社区臭名昭著的一个问题","content":"<sr-rd-content>…</sr-rd-content>"}

EXAMPLE RESPONSE
{
    "status": "success",
    "result": {
        "ok": true,
        "result": {
            "path": "JS-社区臭名昭著的一个问题-12-31-2",
            "url": "https://telegra.ph/JS-社区臭名昭著的一个问题-12-31-2",
            "title": "JS 社区臭名昭著的一个问题",
            "description": "",
            "views": 0,
            "can_edit": true
        }
    }
}
*/