const frontend = false;

export function filterContent(
  dom: HTMLElement,
  document: Document
): HTMLElement {
  function changeTagName(ele: HTMLElement | Element, newTagName: string): void {
    var parent = ele.parentNode;
    var newElement = document.createElement(newTagName);
    newElement.innerHTML = ele.innerHTML;
    parent?.insertBefore(newElement, ele);
    parent?.removeChild(ele);
  }

  dom.querySelectorAll("style").forEach((ele) => ele.remove());

  // br
  dom
    .querySelectorAll(
      "a, aside, blockquote, code, figcaption, figure, h3, h4, hr, li, ol, p, pre, ul"
    )
    .forEach((ele) => (ele.outerHTML = ele.outerHTML.trim()));
  dom.querySelectorAll("code").forEach((ele) => {
    ele.innerHTML = ele.innerHTML.replace(/(\n)+/g, "<br/>");
    if (ele.parentElement?.tagName === "PRE") {
      // turn <pre><code>hello</code></pre> into <pre>hello</pre>!
      if (ele.parentElement.childElementCount === 1)
        ele.parentElement.innerHTML = ele.innerHTML;
      else ele.outerHTML = ele.innerHTML;
    }
  });
  dom.innerHTML = dom.innerHTML.replace(/\n/g, "");
  //.replace(/(<br( *\/? *|\s[^<>]*)?>\s*)+/gim, "\n")
  dom.querySelectorAll("br").forEach((ele) => (ele.outerHTML = "\n"));
  dom.innerHTML = dom.innerHTML.replace(/(\n)+/g, "\n");
  /* replace multiple br tags with one line break, and 
  Telegraph will convert it to <br class="inline">. */

  if (frontend) {
    // sr-annote
    const annotations = dom.querySelectorAll("sr-annote");
    annotations.forEach((x) => changeTagName(x, "B"));

    // sr-blockquote
    const bqs = dom.querySelectorAll("sr-blockquote");
    bqs.forEach((x) => changeTagName(x, "BLOCKQUOTE"));
  }

  // headlines: Telegraph allows h3, h4 only
  dom.querySelectorAll("h4,h5,h6").forEach((x) => {
    x.innerHTML = `<b>${x.innerHTML}</b>`;
    changeTagName(x, "P");
  });
  // turn h2 into h3 and h3 into h4
  dom.querySelectorAll("h2").forEach((x) => {
    changeTagName(x, "h3");
    x.innerText = x.innerText; // remove tags in h3, h4
  });
  dom.querySelectorAll("h3").forEach((x) => {
    changeTagName(x, "h4");
    x.innerText = x.innerText;
  });

  // <section>
  if (frontend) {
    dom.querySelectorAll("section").forEach((x) => {
      let els = [],
        a: HTMLElement | null = x;
      while (a) {
        els.unshift(a);
        a = a.parentElement;
      }
      let flag = false;
      els.forEach((y) => {
        if (y.tagName === "LI" || y.tagName === "UL") {
          flag = true;
        }
      });
      if (flag) return;
      // append a <hr> tag to the end of the section
      x.innerHTML += "<hr>";
      // replace <section> with its child elements
      x.replaceWith(...x.childNodes);
    });
  }

  // #TODO: Extract the image from unecessary elements in a <figure>

  // hljs
  if (frontend) {
    const _hljs = dom.querySelectorAll(".hljs");
    if (_hljs)
      for (let ele of _hljs) {
        let code_tag = <HTMLElement>ele;
        if (
          ele.tagName != "DIV" &&
          ele.parentNode &&
          (<Element>ele.parentNode).tagName == "DIV"
        ) {
          Array.from(ele.parentNode.children).forEach((x) => {
            if (x.tagName == "DIV") x.remove();
          });
          if (ele.querySelectorAll(".hljs").length == 1) {
            ele.parentNode.parentNode &&
            (<HTMLElement>ele.parentNode.parentNode).tagName == "DIV"
              ? (code_tag = <HTMLElement>ele.parentNode.parentNode)
              : ele.parentNode;
          }
        }
        code_tag.innerHTML = "";
        code_tag.innerText = (<HTMLElement>ele).innerText;
      }
  }

  if (dom.querySelector("sr-rd-mult") != null) {
    let parent = dom.querySelector("sr-rd-mult")?.parentNode;
    if (parent) {
      for (let mult of parent.children) {
        if (mult.tagName == "SR-RD-MULT") {
          if (
            mult.nextElementSibling &&
            mult.nextElementSibling.tagName == "SR-RD-MULT"
          )
            parent.insertBefore(
              document.createElement("hr"),
              mult.nextElementSibling
            );
          const mult_children =
            mult?.querySelector("sr-rd-mult-content")?.children;
          if (mult_children) {
            for (let x of mult_children) parent.insertBefore(x, mult);
            mult.remove();
          }
        }
      }
    }
  }
  return dom;
}
