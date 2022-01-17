import { domToNode, nodeToDom } from "./domparser";
import fs from "fs";
import { filterContent } from "./filter";
import { uploadDomMedia } from "./mediahandler";
import bent from "bent";
const post = bent("POST", "json");

interface TelegraphUploadData {
  access_token: string;
  title: string;
  content: string;
  return_content: boolean;
}

interface TelegraphCreateArticleResponse {
  ok: boolean;
  result?: {
    path: string;
    url: string;
    title: string;
    description: string;
    views: number;
    can_edit: boolean;
    author_name?: string;
    // Optional. Name of the author, displayed below the title.
    author_url?: string;
    // Optional. Profile link, opened when users click on the author's name below the title.  Can be any link, not necessarily to a Telegram profile or channel.
    image_url?: string;
    // Optional. Image URL of the page.
    content?: any;
    // Optional. Content of the page.
  };
}

const limitLength = (text: string): string => {
  if (text.length >= 85) return text.slice(0, 84) + "…";
  if (text.length <= 1) return "SimpRead-" + text;
  return text;
  // 一个汉字 encodeURIComponent() 后占据 9 个字符的长度（形如 %E5%AD%97）
};

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

export async function publish_sr_content(
  access_token: string,
  title: string,
  content: string,
  path?: string,
  return_content?: boolean
) {
  const dom = new JSDOM(content);
  const document = dom.window.document;
  const body = document.body;
  const filtered_content = filterContent(body, document);
  const uploaded_content = await uploadDomMedia(filtered_content, document);
  const finalobj = domToNode(uploaded_content).children[0].children;
  return publish(
    access_token,
    title,
    finalobj,
  //callback,
    path,
    return_content
  );
};

async function publish(
  access_token: string,
  title: string,
  content: object,
  path?: string,
  return_content?: boolean
) {
  const data: TelegraphUploadData = {
    access_token: access_token,
    title: limitLength(title),
    content: JSON.stringify(content),
    return_content: return_content || false,
  };
  console.log(data);
  // POST to api.telegra.ph/createPage
  return await (post("https://api.telegra.ph/createPage", data)) as Promise<TelegraphCreateArticleResponse>;
}

async function test() {
  const html: string = fs.readFileSync("./src/sr-read-content.html", "utf-8");
  // copy'n'pasted content from <sr-rd-content> in a random SimpRead page
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const body = document.body;
  const filtered_content = filterContent(body, document);
  const uploaded_content = await uploadDomMedia(filtered_content, document);
  const testobj = domToNode(uploaded_content).children[0].children;

  await publish(
    "4e7863a07443979b1523e3a78b5251188815a5ada9b32bb6d3ec852e808d",
    "SimpreadAPITest",
    testobj
    //(err, res) => {console.log(res);}
  );
}

// test();

const exampleobj = {
  // AN EXAMPLE
  tag: "body",
  children: [
    {
      tag: "sr-rd-content",
      children: [
        {
          tag: "p",
        },
        "\\n",
      ],
    },
  ],
};
