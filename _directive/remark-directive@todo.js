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
import {directive} from 'coolma'
import {directiveFromMarkdown, directiveToMarkdown} from './libs/mdast-util-directive'

import "./index.less"
import VueCompositionApi, {ref, computed} from '@vue/composition-api';
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

async function main() {
  const file = await unified()
    .use(remarkParse)
    .use(remarkDirective)
    .use(myRemarkPlugin)
    .use(remarkRehype)
    .use(rehypeFormat)
    .use(rehypeStringify)
    .process(`A lovely language know as @abbr[namespace](HTML, "HyperText Markup Language的缩写"){.red}`)

  console.log(String(file))
}

function myRemarkPlugin() {
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === 'textDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'containerDirective'
      ) {
        const data = node.data || (node.data = {})
        const hast = h(node.name, node.attributes)

        data.hName = hast.tagName
        data.hProperties = hast.properties
      }
    })
  }
}

const App = {
  template: `
    <div>
  

   
    </div>
    
  `,
  setup() {

    main()
  }
}

Vue.config.productionTip = false


new Vue({
  el: '#app',
  render: h => h(App)
})
