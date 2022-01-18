import { publish_sr_content } from "./uploader";

interface Article {
  url: string;
  title: string;
  content: string;
  desc: string;
  tags: string;
}
interface Telegram {
  bind?: boolean;
  name?: string;
  link?: string;
}
interface PublishParameters {
  article: Article;
  telegram?: Telegram;
  telegraph?: {
    access_token?: string;
    author_name?: string;
    author_url?: string;
  };
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
        process.env.ENV_VARIABLE ||
        "4e7863a07443979b1523e3a78b5251188815a5ada9b32bb6d3ec852e808d";
    const res = await publish_sr_content(
      access_token,
      param.article.title || "SimpreadArticle",
      param.article.content,
      undefined,
      false,
      author_name,
      author_url
    );
    return {
      status: "success",
      telegraph: res,
    };
  } catch (e) {
    console.log(e);
    return {
      status: "error",
    };
  }
}
