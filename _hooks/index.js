import Vue from 'vue'
import * as fs from 'fs'
import {micromark} from 'micromark'
import {directive, directiveHtml} from 'micromark-extension-directive'

import VueCompositionApi, {computed, reactive, ref } from '@vue/composition-api';
Vue.use(VueCompositionApi);


const App = {
  template: `
    <div>
  
    sss
      
    </div>
    
  `,
  setup() {
    
    const output = micromark(fs.readFileSync('./example.md'), {
      extensions: [directive()],
      htmlExtensions: [directiveHtml({abbr})]
    })
    
    console.log(output)
    
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
   
    }
  }
}

Vue.config.productionTip = false


new Vue({
  el: '#app',
  render: h => h(App)
})
