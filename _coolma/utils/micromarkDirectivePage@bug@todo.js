import Vue from 'vue'
// import fs from 'fs-extra'
import {micromark} from 'micromark'
// import {directive, directiveHtml} from 'micromark-extension-directive'
import {directive, directiveHtml} from 'coolma'
import "../style.less"
import VueCompositionApi, {ref, computed, watchEffect} from '@vue/composition-api';

import {visitParents} from "unist-util-visit-parents"
import {h} from 'hastscript'

import {fromMarkdown} from 'mdast-util-from-markdown'
import {toMarkdown} from 'mdast-util-to-markdown'

import { directiveFromMarkdown, directiveToMarkdown} from './mdastDdirective'
// import "@picocss/pico/css/pico.classless.min.css"

Vue.use(VueCompositionApi);

const App = {
  template: `
    <div>
  
    <p>演示注解: @abbr + @nice</p>

    <textarea style="width:100%;height: 300px;" v-model="before"></textarea>

    <div v-html="after"></div>
   
    </div>
    
  `,
  setup() {

    const initContent = `# abbr测试 @nice   @abbr("222", "2222"){.red}
    
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
}



原始文字 @nice 

@nice 原始文字

原始文字A @nice 原始文字B

原始文字A 原始文字B @nice 

原始文字A 原始文字B @nice @nice

`

    const before = ref(initContent)
    
    const tree = computed(() => {
      const tree = fromMarkdown(before.value, {
        extensions: [directive()],
        mdastExtensions: [directiveFromMarkdown]
      })

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
                    const nextNode = latestAncestors.children[idx+1]
                    const prevNode = latestAncestors.children[idx-1]

                    if (nextNode && nextNode.type === "text") {
                      console.log("修改后节点")
                      // console.log(nextNode)
                      // nextNode.type = "em"
                      nextNode.value = nextNode.value + "(替换)"
                      // node.args = [nextNode.value]

                    } else if (prevNode && prevNode.type === "text") {
                      console.log("修改前节点")
                      // console.log(prevNode)

                      prevNode.value =  prevNode.value + "(替换)"
                      // ancestors[1].children[idx-1] = h("textttt", {}, ["ssss"])
                      // node.args = [prevNode.value]

                    }

                    break;
                }

            }
          }
        }
 
      })

      return tree
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
