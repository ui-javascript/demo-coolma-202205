import Vue from 'vue'
// import fs from 'fs-extra'
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import {visit} from 'unist-util-visit'
import {h} from 'hastscript'

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

    const before = ref(`A lovely language know as @abbr[namespace](HTML, "HTML的全称"){.red.blue #id}`);

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
