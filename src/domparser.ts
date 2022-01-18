export type graphNode = string | graphNodeTL;

export type graphNodeTL = {
  tag: string;
  children?: graphNode[];
};
export function domToNode(domNode: HTMLElement) {
  if (domNode.nodeType == domNode.TEXT_NODE) {
    return domNode.textContent;
    //return domNode.data;
  }
  if (domNode.nodeType != domNode.ELEMENT_NODE) return false;
  let nodeElement: any = {};
  nodeElement.tag = domNode.tagName.toLowerCase();
  for (let i = 0; i < domNode.attributes.length; i++) {
    var attr = domNode.attributes[i];
    if (attr.name == "href" || attr.name == "src") {
      if (!nodeElement.attrs) nodeElement.attrs = {};
      nodeElement.attrs[attr.name] = attr.value;
    }
  }
  if (domNode.childNodes.length > 0) {
    nodeElement.children = [];
    for (let i = 0; i < domNode.childNodes.length; i++)
      nodeElement.children.push(domToNode(<HTMLElement>domNode.childNodes[i]));
  }
  return nodeElement;
}

export function nodeToDom(node: any) {
  if (typeof node === "string" || node instanceof String)
    return document.createTextNode(node.toString());
  if (node.tag) {
    var domNode: any = document.createElement(node.tag);
    if (node.attrs) {
      for (var name in node.attrs) domNode.setAttribute(name, node.attrs[name]);
    }
  } else {
    var domNode: any = document.createDocumentFragment();
  }
  if (node.children) {
    for (var i = 0; i < node.children.length; i++) {
      domNode.appendChild(nodeToDom(node.children[i]));
    }
  }
  return domNode;
}

export function lineFilter(obj: graphNode): graphNode {
  // const orgObj = JSON.parse(JSON.stringify(obj));
  if (typeof obj === "object") {
    if (obj.children) {
      let children = obj.children;
      children = children
        .map((child) => {
          return lineFilter(child);
        })
        .filter((child) => {
          if (typeof child === "string"){
            if (/\n/.test(child)) return true;
            if (child.trim() === "") return false;
          }
          return true;
          
          //const result1 =
          //  typeof child === "string" &&
          //  (/\n/.test(child.trim()) || // Contains linebreak
          //    child.trim() === ""); // All whitespace chars
          //const result2 = obj.tag === "code" || obj.tag === "pre" || !result1;
          //console.log("!CHILD", child, "whitespace", result1);
          //return result2;
        });
      obj.children = children;
      return obj;
    }
    // if (obj != orgObj) console.log("N EQ:", obj, "=>", orgObj);
  }
  return obj;
}
/*
  function nodeFilter(obj) {
    console.log(obj);
    if (typeof (obj) == "object") {
    if (obj["tag"] === "body" || obj["tag"].startsWith("sr-")) {
      if (obj["children"]) return nodeFilter(obj.children[0]);
      else return obj;
    }
    else {
      if (obj["children"]) {
        const children = obj.children.map(c => nodeFilter(c))
        return {
          "tag": obj.tag,
          "children": children
        }
      };
      return obj;
    }
  } else {
    return obj;
  }
}
*/
