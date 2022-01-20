import { publish_sr_content } from "./uploader";

interface PublishResponse {
  status: "success" | "error";
  telegraph?: TelegraphCreateArticleResponse;
  telegram?: any;
}

export async function publish(
  param: PublishParameters
): Promise<PublishResponse> {
  try {
    const url = param.article.url;
    const { hostname } = new URL(url);
    let author_url = param.telegraph?.author_url || url;
    let author_name = param.telegraph?.author_name || hostname;
    if (param.telegram && param.telegram.bind === true) {
      if (param.telegram.name) author_name = param.telegram.name;
      if (param.telegram.link) author_url = param.telegram.link;
    }
    if (param?.telegraph?.access_token)
      var access_token = param.telegraph.access_token;
    else
      var access_token =
        process.env.SR_TELEGRAPH_ACCESS_TOKEN ||
        process.env.TELEGRAPH_ACCESS_TOKEN ||
        "4e7863a07443979b1523e3a78b5251188815a5ada9b32bb6d3ec852e808d";
    if (param?.style?.use_desc === true)
      param.article.content = `<blockquote>${param.article.desc}</blockquote>${param.article.content}`;
    const res = await publish_sr_content(
      access_token,
      param.article.title?.replace(/ +\-+ +/g, "—") || "SimpreadArticle",
      param.article.content,
      undefined, // path not implemented
      false,
      author_name,
      author_url, param?.test
    );
    return {
      status: "success",
      telegraph: res,
    };
  } catch (e) {
    console.warn(e);
    return {
      status: "error",
    };
  }
}
