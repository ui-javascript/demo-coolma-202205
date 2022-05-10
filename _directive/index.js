import Vue from "vue";
// import fs from 'fs-extra'
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import { h } from "hastscript";
import { u } from "unist-builder";

import { visitParents } from "unist-util-visit-parents";

// import {directive, directiveHtml} from 'micromark-extension-directive'
import { directive, directiveHtml } from "coolma";
import {
  directiveToMarkdown,
  directiveFromMarkdown,
} from "./libs/mdast-util-directive";

import "./style.less";
import VueCompositionApi, {
  ref,
  computed,
  watchEffect,
} from "@vue/composition-api";
import { trim } from "lodash";
Vue.use(VueCompositionApi);

export default function remarkDirective() {
  const data = this.data();

  add("micromarkExtensions", directive());
  add("fromMarkdownExtensions", directiveFromMarkdown);
  add("toMarkdownExtensions", directiveToMarkdown);

  /**
   * @param {string} field
   * @param {unknown} value
   */
  function add(field, value) {
    const list /** @type {unknown[]} */ =
      // Other extensions
      /* c8 ignore next 2 */
      data[field] ? data[field] : (data[field] = []);

    list.push(value);
  }
}

function registerAnnoNice(node, ancestors) {
  if (node.name != "nice") {
    return;
  }

  console.log("父节点");
  console.log(ancestors);

  const latestAncestors = ancestors[ancestors.length - 1];

  if (!latestAncestors.children || latestAncestors.children.length === 0) {
    return;
  }

  for (let idx in latestAncestors.children) {
    // console.log("节点" + idx)
    // console.log(item)
    const item = latestAncestors.children[idx];
    idx = parseInt(idx);

    if (
      item.type === "textDirective" 
      && item.name === "nice"  // @todo 准确定位标签
    ) {
      let nextIdx = idx;
      let prevIdx = idx;
      let nextNode = null;
      let prevNode = null;

      while (++nextIdx < latestAncestors.children.length) {
        const tempNode = latestAncestors.children[nextIdx];

        if (tempNode && tempNode.type === "text" && trim(tempNode.value)) {
          nextNode = tempNode;
          break;
        }
      }

      if (!nextNode) {
        // debugger;
        while (--prevIdx > -1) {
          const tempNode = latestAncestors.children[prevIdx];

          if (tempNode && tempNode.type === "text" && trim(tempNode.value)) {
            // debugger;
            prevNode = tempNode;
            break;
          }
        }
      }

      if (nextNode) {
        console.log("修改后节点");
        console.log(nextNode);

        const data = nextNode.data || (nextNode.data = {});
        const hast = h("mark", nextNode.value);
        data.hName = hast.tagName;
        data.hProperties = hast.properties;
        data.hChildren = hast.children;
      } else if (prevNode) {
        console.log("修改前节点");
        console.log(prevNode);

        const data = prevNode.data || (prevNode.data = {});
        const hast = h("mark", prevNode.value);
        data.hName = hast.tagName;
        data.hProperties = hast.properties;
        data.hChildren = hast.children;
      }

      renderVoidElement(node)

      break;
    }
  }
}

 // @todo 暂时先伪装成块内元素
function renderVoidElement(node) {
   const nodeData = node.data || (node.data = {});
   nodeData.hName = h("span", {}).tagName;
}


function registerAnnoFetch(node, ancestors) {

  if (node.name != "fetch") {
    return;
  }

  if (!node.args || node.args.length === 0) {
    renderVoidElement(node)
    return;
  }


}


function registerAnnoAbbr(node) {
  if (node.name != "abbr") {
    return;
  }

  // console.log("node ==>")
  // console.log(node)
  const data = node.data || (node.data = {});
  if (!("title" in node.attributes) && node.args && node.args.length > 1) {
    node.attributes.title = node.args[1];
  }
  const hast = h(node.name, node.attributes, [
    node.args && node.args.length > 0 ? node.args[0] : "",
  ]);

  data.hName = hast.tagName;
  data.hProperties = hast.properties;
  // console.log(hast);

  node.children = hast.children;
}



function myRemarkPlugin() {
  return (tree) => {
    visitParents(tree, "textDirective", (node, ancestors) => {
      // 注册@abbr
      registerAnnoAbbr(node);

      if (!ancestors || ancestors.length === 0) {
        return;
      }

      // 注册@nice
      registerAnnoNice(node, ancestors);

      // 注册@fetch
      registerAnnoFetch(node, ancestors);
    });
  };
}

const App = {
  template: `
    <div>
  
  
    <textarea style="width:100%;height: 300px;" v-model="before"></textarea>

    <div v-html="after"></div>
   
    </div>
    
  `,
  setup() {
    const before = ref(`# A lovely language know as @abbr[namespace](HTML, "HTML的全称"){.red.blue #id} @nice

@abbr(HTML, "HTML的全称"){.bg-blue}

hello @nice
  
@nice hello

hello hi @nice @nice

hello hi *em* @abbr(HTML, "HTML的全称"){.bg-blue} @nice @nice

hello @nice @nice hi
`);

    const after = ref("");
    watchEffect(async () => {
      const res = await unified()
        .use(remarkParse)
        .use(remarkDirective)
        .use(myRemarkPlugin)
        .use(remarkRehype)
        .use(rehypeFormat)
        .use(rehypeStringify)
        .process(before.value);

      console.log(String(res));
      after.value = String(res);
    });

    return {
      before,
      after,
    };
  },
};

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  render: (h) => h(App),
});
