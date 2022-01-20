const { uploadByUrl } = require('telegraph-uploader')

export async function uploadMedia(link: URL): Promise<URL> {
  let result: string;
  try {
    result = (await uploadByUrl(link.toString())).path;
  } catch (e) {
    console.warn("=!= MEDIA UPLOADING ERR: " + link.toString());
    return link; // Use the original link instead. It'll work well on telegra.ph the website.
  }
  if (!result.startsWith('/')) result = '/' + result;
  console.log("=== Uploaded file is at", "https://telegra.ph" + result);
  return new URL("https://telegra.ph" + result);
}

export async function uploadDomMedia(dom: HTMLElement, document: Document, limit: number): Promise<HTMLElement> {
  const imgs = dom.querySelectorAll("img");
  let imglist = Array.prototype.slice.call(imgs);
  let counter = limit > 0 ? limit : Infinity; //dbg
  for (let x of imglist) {
    if (counter >= limit) break;
    console.log(`=== Now Uploading ${++counter} img`, x.src);
    x.src = (await uploadMedia(<URL>x.src)).toString();
  }
  return dom;
}