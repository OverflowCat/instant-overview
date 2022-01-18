import { publish_sr_content } from "./uploader";

interface Article {
  url: string;
  title: string;
  content: string;
  desc: string;
  tags: string;
}
interface Telegram {

}
interface PublishParameters {
  article: Article;
  telegram?: Telegram;
  telegraph?: {
    access_token?: string;
  }
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

export async function publish(param: PublishParameters) : Promise<PublishResponse>{
  try {
  const res = await publish_sr_content(
    "4e7863a07443979b1523e3a78b5251188815a5ada9b32bb6d3ec852e808d",
    param.article.title || "SimpreadArticle",
    param.article.content
  );
  return {
    status: "success",
    telegraph: res,
  };}
  catch (e) {
    console.log(e);
    return {
      status: "error"
    }
  }
}