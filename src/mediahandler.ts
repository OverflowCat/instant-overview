const { uploadByUrl } = require('telegraph-uploader')
interface MediaUploadResponse {
  link: URL;
  file: string;
}

export async function uploadMedia(link: URL): Promise<URL> {
  let result: string;
  try {
    result = await uploadByUrl(link.toString());
    //  .then((result: MediaUploadResponse) => console.log(result))
  } catch (e) {
    console.log("Media upload err: " + link.toString);
    return link; // 返回原来的链接
  }
  if (!result.startsWith('/')) result = '/' + result;
  return new URL("https://telegra.ph" + result);
}

// test
// uploadMedia(new URL("xxx"));

export async function uploadDomMedia(dom: HTMLElement, document: Document): Promise<HTMLElement> {
  const imgs = dom.querySelectorAll("img");
  const imglist = Array.prototype.slice.call(imgs);
  imglist.forEach(async (x) => x.src = await uploadMedia(<URL>x.currentSrc))
  return dom;
}