import Vue from 'vue'
// import fs from 'fs-extra'
import {micromark} from 'micromark'
// import {directive, directiveHtml} from 'micromark-extension-directive'
import {directive, directiveHtml} from 'coolma'
import "./index.less"
import VueCompositionApi, {ref, computed} from '@vue/composition-api';

import {visitParents} from "unist-util-visit-parents"

import {fromMarkdown} from 'mdast-util-from-markdown'
import {toMarkdown} from 'mdast-util-to-markdown'

import {directiveFromMarkdown} from 'mdast-util-directive'

import { directiveToMarkdown} from './libs/mdast-util-directive'




Vue.use(VueCompositionApi);

const App = {
  template: `
    <div>
  
    <textarea style="width:100%;height: 300px;" v-model="before"></textarea>

    <div v-html="after"></div>
   
    </div>
    
  `,
  setup() {

    const initContent = `# abbr测试
- 简单示例

A lovely language know as @abbr(HTML, "HyperText Markup Language")
    
- 复杂示例

A lovely language know as @abbr[namespace](HTML){
title: "HyperText Markup Language的缩写"
, name:12
, attr: attrxxxxx
.bg-blue
.red
#id_html
}`

    const before = ref(initContent)
    
    
    const tree = computed(() => {
      return fromMarkdown(before.value, {
        extensions: [directive()],
        mdastExtensions: [directiveFromMarkdown]
      })
    }) 
    // console.log(tree)
    
    visitParents(tree, 'textDirective', (node, ancestors) => {
      console.log("父节点")
      console.log(ancestors)
    })
    
    
    const out = computed(() => {
      console.log("树")
      console.log(tree.value)
      return toMarkdown(tree.value, {extensions: [directiveToMarkdown]})
    }) 

    const after = computed(() => {
      // console.log("触发更新")
      return micromark(out.value, {
        extensions: [directive()],
        htmlExtensions: [directiveHtml({abbr})]
      })
    })
    
    function abbr(d) {
     
      if (d.type !== 'textDirective') return false
      // console.log(d)

      // visitParents(d, "textDirective", (_, parents) => {
      //   console.log("父节点")
      //   console.log(parents)
      //   console.log(_)
      // })

      this.tag('<abbr')
    
      if (d.attributes) {
        if ('id' in d.attributes) {
          this.tag(' id="' + this.encode(d.attributes.id) + '"')
        }
        if ('class' in d.attributes) {
          this.tag(' class="' + this.encode(d.attributes.class) + '"')
        }
      }

      if (d.attributes && 'title' in d.attributes) {
        this.tag(' title="' + this.encode(d.attributes.title) + '"')
      } else {
        this.tag(' title="' + this.encode(d.args && d.args.length > 1 ? d.args[1] : '') + '"')
      }

    
      this.tag('>')
      this.raw(d.args && d.args.length > 0 ? d.args[0] : '')
      this.tag('</abbr>')
    }

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
