import Vue from 'vue'
// import fs from 'fs-extra'
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import {visit} from 'unist-util-visit'
import {h} from 'hastscript'
import {u} from 'unist-builder'

import {visitParents} from "unist-util-visit-parents"

// import {directive, directiveHtml} from 'micromark-extension-directive'
import {directive, directiveHtml} from 'coolma'
import { directiveToMarkdown, directiveFromMarkdown} from './libs/mdast-util-directive'

import "./index.less"
import VueCompositionApi, {ref, computed, watchEffect} from '@vue/composition-api';
Vue.use(VueCompositionApi);


export default function remarkDirective() {
  const data = this.data()

  add('micromarkExtensions', directive())
  add('fromMarkdownExtensions', directiveFromMarkdown)
  add('toMarkdownExtensions', directiveToMarkdown)

  /**
   * @param {string} field
   * @param {unknown} value
   */
  function add(field, value) {
    const list = /** @type {unknown[]} */ (
      // Other extensions
      /* c8 ignore next 2 */
      data[field] ? data[field] : (data[field] = [])
    )

    list.push(value)
  }
}


function myRemarkPlugin() {
  return (tree) => {

    visitParents(tree, 'textDirective', (node, ancestors) => {
      
      if (ancestors && ancestors.length > 1 && node.name == "nice" && (!node.args || node.args.length === 0)) {
        console.log("父节点")
        console.log(ancestors)

        const latestAncestors = ancestors[ancestors.length-1]

        if (latestAncestors.children && latestAncestors.children.length > 0) {
          for (let idx in latestAncestors.children) {
              // console.log("节点" + idx)
              // console.log(item)
              const item = latestAncestors.children[idx]
              idx = parseInt(idx)

              if ((item.type === 'textDirective' && item.name === "nice") // @todo 准确定位标签
                && (!item.args || item.args.length === 0)) {
                  let nextNode = latestAncestors.children[idx+1]
                  let prevNode = latestAncestors.children[idx-1]

                  if (nextNode && nextNode.type === "text") {
                    console.log("修改后节点")
                    console.log(nextNode)
                    // nextNode.type = "em"
                    nextNode.value = nextNode.value + "(替换)"
                    // nextNode = h("inlineCode", {}, [nextNode.value])
                    // node.args = [nextNode.value]

                  } else if (prevNode && prevNode.type === "text") {
                    console.log("修改前节点")
                    console.log(prevNode)

                    prevNode.value =  prevNode.value + "(替换)"
                    // prevNode = h('span', {}, prevNode.value + "(替换)")
                    // prevNode = h("inlineCode", {}, [prevNode.value])
                    // node.args = [prevNode.value]
                    // const hast = h('input', {type: 'text', value: prevNode.value})
                    // prevNode.children = hast.children

                  }

                  break;
              }

          }
        }
      }

    })

    visit(tree, (node) => {
      if (
        node.type === 'textDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'containerDirective'
      ) {

        console.log("node ==>")
        console.log(node)

        if (node.name === 'abbr') {
          const data = node.data || (node.data = {})
          if (!('title' in node.attributes) && node.args && node.args.length > 1) {
            node.attributes.title = node.args[1]
          }
          const hast = h(node.name, node.attributes, [node.args && node.args.length > 0 ? node.args[0] : ''])
  
          data.hName = hast.tagName
          data.hProperties = hast.properties
          console.log(hast)

          node.children = hast.children
        }
     
        
      }
    })
  }
}

const App = {
  template: `
    <div>
  
  
    <textarea style="width:100%;height: 300px;" v-model="before"></textarea>

    <div v-html="after"></div>
   
    </div>
    
  `,
  setup() {

    const before = ref(`A lovely language know as @abbr[namespace](HTML, "HTML的全称"){.red.blue #id}
hello @nice  

@nice hello

hello @nice  @nice
`);

    const after = ref("")
    watchEffect(async () => {
      const res = await unified()
        .use(remarkParse)
        .use(remarkDirective)
        .use(myRemarkPlugin)
        .use(remarkRehype)
        .use(rehypeFormat)
        .use(rehypeStringify)
        .process(before.value)

      console.log(String(res))
      after.value = String(res)
    })

    return {
      before,
      after
    }

  }
}

Vue.config.productionTip = false


new Vue({
  el: '#app',
  render: h => h(App)
})
