import { domToNode, nodeToDom } from "./domparser";
import fs from "fs";

const limitLength = (text: string) : string => {
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

console.log(domToNode(doc));
console.log(JSON.stringify(domToNode(doc)));
