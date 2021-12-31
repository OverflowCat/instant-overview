const { uploadByUrl } = require('telegraph-uploader')

export async function uploadMedia(link: URL): Promise<URL> {
  let result: string;
  try {
    result = (await uploadByUrl(link.toString())).path;
  } catch (e) {
    console.warn("MEDIA UPLOADING ERR: " + link.toString);
    return link; // Use the original link instead. It'll work well on telegra.ph the website.
  }
  if (!result.startsWith('/')) result = '/' + result;
  console.log("== Uploaded file is at", "https://telegra.ph" + result);
  return new URL("https://telegra.ph" + result);
}

export async function uploadDomMedia(dom: HTMLElement, document: Document): Promise<HTMLElement> {
  let imgs = dom.querySelectorAll("img");
  let imglist = Array.prototype.slice.call(imgs);
  for (let x of imglist) {
    console.log("== Now Uploading img ", x.src);
    x.src = (await uploadMedia(<URL>x.src)).toString();
  }
  return dom;
}