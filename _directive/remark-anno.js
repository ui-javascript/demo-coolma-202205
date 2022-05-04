import Vue from 'vue'

import {read, toVFile, readSync} from 'to-vfile'
import {unified} from 'unified'
import remarkDirective from 'remark-directive'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import {visit} from 'unist-util-visit'
import {h} from 'hastscript'

import VueCompositionApi, { ref } from '@vue/composition-api';
Vue.use(VueCompositionApi);

const App = {
  template: `
  <div>
  
  <pre>
  {{ before }}


  {{ after }}
  </pre>  
  </div>
  `,
  setup() {

const before = ref(`:::main{#readme

Lorem:br
ipsum.

::hr{.red}

A :i[lovely] language know as :abbr[HTML]{title="HyperText Markup Language"}.

:::`)    

    const after = ref("")

    async function main() {
      const file = await unified()
        .use(remarkParse)
        .use(remarkDirective)
        .use(myRemarkPlugin)
        .use(remarkRehype)
        .use(rehypeFormat)
        .use(rehypeStringify)
        .process(before)
        .process(before)
        // .process(await read('example.md'))
        // .process(toVFile(new URL('example.md', import.meta.url)))
        // .process(readSync('example.com'))
    

      console.log(String(file))  
      after.value = String(file)
    }

    
    // This plugin is an example to let users write HTML with directives.
    // It’s informative but rather useless.
    // See below for others examples.
    /** @type {import('unified').Plugin<[], import('mdast').Root>} */
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

    main()

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
