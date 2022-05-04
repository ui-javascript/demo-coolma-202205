import Vue from 'vue'
// import fs from 'fs-extra'
import {micromark} from 'micromark'
// import {directive, directiveHtml} from 'micromark-extension-directive'
import {directive, directiveHtml} from 'coolma'

import VueCompositionApi from '@vue/composition-api';
Vue.use(VueCompositionApi);

const App = {
  template: `
    <div>
  
    <div v-html="before"></div>
    <div v-html="after"></div>
   
    </div>
    
  `,
  setup() {

    const before = `A lovely language know as @abbr(HTML){title="HyperText Markup Language"}.`
    
    const after = micromark(before, {
      extensions: [directive()],
      htmlExtensions: [directiveHtml({abbr})]
    })
    
    
    function abbr(d) {
      if (d.type !== 'textDirective') return false
    
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
