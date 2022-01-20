interface TelegraphCreatePageRequest {
  /* createPage
  Use this method to create a new Telegraph page. On success, returns a Page object. */
  access_token: string; // access_token (String)
  // Required. Access token of the Telegraph account.
  title: string; // title (String, 1-256 characters)
  // Required. Page title.
  author_name?: string; // author_name (String, 0-128 characters)
  // Author name, displayed below the article's title.
  author_url?: string; // (String, 0-512 characters)
  // Profile link, opened when users click on the author's name below the title. Can be any link, not necessarily to a Telegram profile or channel.
  content: object; // (Array of Node, up to 64 KB)
  // Required. Content of the page.
  return_content?: boolean; // return_content (Boolean, default = false)
  // If true, a content field will be returned in the Page object (see: Content format). */
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
  version?: number;
  article: Article;
  telegram?: Telegram;
  telegraph?: {
    access_token?: string;
    author_name?: string;
    author_url?: string;
  };
  style?: {
    use_desc?: boolean;
  };
  test?: TestConfig;
}
interface TestConfig {
  debug?: true;
  imguploadlimit?: number;
  weixinpicproxy?: boolean;
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