const { uploadByUrl } = require('telegraph-uploader')
interface MediaUploadResponse {
  link: URL;
  file: string;
}

export async function uploadMedia(link: URL): Promise<URL> {
  let result: string;
  try {
    result = (await uploadByUrl(link.toString())).path;
    //  .then((result: MediaUploadResponse) => console.log(result))
  } catch (e) {
    console.warn("MEDIA UPLOADING ERR: " + link.toString);
    return link; // 返回原来的链接
  }
  if (!result.startsWith('/')) result = '/' + result;
  console.log("== Got link! Uploaded file is at", "https://telegra.ph" + result);
  return new URL("https://telegra.ph" + result);
}

// test
// uploadMedia(new URL("xxx"));

export async function uploadDomMedia(dom: HTMLElement, document: Document): Promise<HTMLElement> {
  let imgs = dom.querySelectorAll("img");
  let imglist = Array.prototype.slice.call(imgs);
  for (let x of imglist) {
    console.log("== Now Uploading img ", x.src);
    x.src = (await uploadMedia(<URL>x.src)).toString();
    // console.log("现在的 x.src 是：", x.src);
  }
  return dom;
}