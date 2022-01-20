import { domToNode, graphNodeTL, lineFilter } from "./domparser";
// import fs from "fs";
import { filterContent } from "./filter";
import { uploadDomMedia } from "./mediahandler";
import bent from "bent";
const post = bent("POST", "json");
const needPublish = true;
const needUploadMedia = true;

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
  return_content: boolean = false,
  author_name?: string,
  author_url?: string,
  test?: any
) {
  const dom = new JSDOM(content);
  const document = dom.window.document;
  const body = document.body;
  const filtered_content = filterContent(body, document);
  const uploaded_content =
    needUploadMedia && needPublish
      ? await uploadDomMedia(filtered_content, document, test.imguploadlimit)
      : filtered_content;

  let lineFilted = lineFilter(domToNode(uploaded_content));
  if (typeof lineFilted !== "string") {
    if (lineFilted.children) {
      const obj = lineFilted.children[0];
      if (typeof obj !== "string") {
        const finalobj = obj.children;
        if (needPublish)
          return publish(
            access_token,
            title,
            finalobj,
            //callback,
            path,
            return_content,
            author_name,
            author_url
          );
        else console.log("Finalobj is:", JSON.stringify(finalobj));
      }
    }
  }
  console.warn(`Ran into error when publishing ${title}.`);
}

async function publish(
  access_token: string,
  title: string,
  content: any,
  path?: string,
  return_content?: boolean,
  author_name?: string,
  author_url?: string
) {
  const data: TelegraphCreatePageRequest = {
    access_token: access_token,
    title: limitLength(title),
    author_name: author_name,
    author_url: author_url,
    content: content,
    return_content: return_content || false,
  };
  console.log("===============!");
  console.log(JSON.stringify(data));
  console.log("===============!")
  // POST to api.telegra.ph/createPage
  return (await post(
    "https://api.telegra.ph/createPage",
    data
  )) as Promise<TelegraphCreateArticleResponse>;
}

// test deleted here
