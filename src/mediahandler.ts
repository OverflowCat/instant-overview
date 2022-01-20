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

export async function uploadDomMedia(dom: HTMLElement, document: Document, test: TestConfig): Promise<HTMLElement> {
  const limit = test.imguploadlimit !== -1 ? test.imguploadlimit || -1 : Infinity; //dbg;
  const imgs = dom.querySelectorAll("img");
  let imglist = Array.prototype.slice.call(imgs);
  let counter = 0;
  console.log("上传图片数量限制：", limit);
  for (let x of imglist) {
    const url = new URL(x.src);
    if (url.hostname === "mmbiz.qpic.cn" && test.weixinpicproxy === true) {// Weixin article
      x.src = "https://api-wrap.sim" + "prea" + "d.pro/api/service/proxy?url=" + x.src;
      continue;
    }
    if (counter >= limit) break;
    console.log(`=== Now Uploading ${++counter} img`, x.src);
    x.src = (await uploadMedia(url)).toString();
  }
  return dom;
}