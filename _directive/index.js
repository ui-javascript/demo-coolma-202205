import Vue from 'vue'
// import fs from 'fs-extra'
import {micromark} from 'micromark'
// import {directive, directiveHtml} from 'micromark-extension-directive'
import {directive, directiveHtml} from 'coolma'

import VueCompositionApi, {ref, computed} from '@vue/composition-api';
Vue.use(VueCompositionApi);

const App = {
  template: `
    <div>
  
    <textarea style="width:100%;height: 100px;" v-model="before"></textarea>

    <div v-html="after"></div>
   
    </div>
    
  `,
  setup() {

    const before = ref(`A lovely language know as @abbr(HTML){title: "HyperText Markup Language", name=12 attr=attrxxxxx}`)
    
    const after = computed(() => {
      console.log("触发更新")
      return micromark(before.value, {
        extensions: [directive()],
        htmlExtensions: [directiveHtml({abbr})]
      })
    })
    
    function abbr(d) {
      if (d.type !== 'textDirective') return false
      console.log(d)
    
      this.tag('<abbr')
    
      if (d.attributes && 'title' in d.attributes) {
        this.tag(' title="' + this.encode(d.attributes.title) + '"')
      }
    
      this.tag('>')
      this.raw(d.label || '')
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
