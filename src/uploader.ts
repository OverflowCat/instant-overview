import { domToNode, nodeToDom } from "./domparser";
import fs from "fs";
import { filterContent } from "./filter";
import fetch from "cross-fetch";

interface TelegraphUploadData {
  access_token: string;
  title: string;
  content: string;
  return_content: boolean;
}

const limitLength = (text: string): string => {
  if (text.length >= 85) return text.slice(0, 84) + "…";
  if (text.length <= 1) return "SimpRead-" + text;
  return text;
  // 一个汉字 encodeURIComponent() 后占据 9 个字符的长度（形如 %E5%AD%97）
};

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const html: string = fs.readFileSync("./src/sr-read-content.html", "utf-8");
const dom = new JSDOM(html);
const doc = dom.window.document.body;

export function publish(
  access_token: string,
  title: string,
  content: object,
  callback: (err: Error | null, data: any) => void,
  path?: string,
  return_content?: boolean
) {
  const data: TelegraphUploadData = {
    access_token: access_token,
    title: limitLength(title),
    content: JSON.stringify(content),
    return_content: return_content || false,
  };

  // POST to api.telegra.ph/createPage
  return fetch("https://api.telegra.ph/createPage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res: any) => callback(null, res.json()));
}

//console.log(domToNode(doc));
//console.log(JSON.stringify(domToNode(doc)));
//console.log("===============================================\n");
const testobj = domToNode(filterContent(doc, dom));
publish(
  "4e7863a07443979b1523e3a78b5251188815a5ada9b32bb6d3ec852e808d",
  "测试",
  testobj,
  (err, res) => {
    console.log(res);
  }
);
