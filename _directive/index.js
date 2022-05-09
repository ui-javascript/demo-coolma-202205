import Vue from 'vue'
// import fs from 'fs-extra'
import {micromark} from 'micromark'
// import {directive, directiveHtml} from 'micromark-extension-directive'
import {directive, directiveHtml} from 'coolma'
import "./index.less"
import VueCompositionApi, {ref, computed} from '@vue/composition-api';
import {visit} from 'unist-util-visit'

Vue.use(VueCompositionApi);

const App = {
  template: `
    <div>
  
    <textarea style="width:100%;height: 300px;" v-model="before"></textarea>

    <div v-html="after"></div>
   
    </div>
    
  `,
  setup() {

    const before = ref(`# abbr测试
- demo1

A lovely language know as @abbr[namespace](HTML, "HyperText Markup Language的缩写"){.red}
    
- demo2

A lovely language know as @abbr[namespace](HTML){
title: "HyperText Markup Language"
, name:12
, attr: attrxxxxx
.bg-blue
#id_html
}
`)
    
    const after = computed(() => {
      console.log("触发更新")
      return micromark(before.value, {
        extensions: [directive()],
        htmlExtensions: [directiveHtml({abbr})]
      })
    })
    
    function abbr(d) {
     
      // if (d.type !== 'textDirective') return false
      console.log(d)

      this.tag('<abbr')
    
      if (d.attributes) {
        if ('title' in d.attributes) {
          this.tag(' title="' + this.encode(d.attributes.title) + '"')
        } else {
          this.tag(' title="' + this.encode(d.args && d.args.length > 1 ? d.args[1] : '') + '"')
        }

        if ('id' in d.attributes) {
          this.tag(' id="' + this.encode(d.attributes.id) + '"')
        }
        if ('class' in d.attributes) {
          this.tag(' class="' + this.encode(d.attributes.class) + '"')
        }
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
