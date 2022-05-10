import Vue from "vue";
import VueCompositionApi, {
  ref,
  watchEffect,
  watch
} from "@vue/composition-api";

import { unified } from "unified";
import { visitParents } from "unist-util-visit-parents";

import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkDirective from "./utils/remark-directive";

import registerAnnoNice from "./anno/@nice";
import registerAnnoAbbr from "./anno/@abbr";
import registerAnnoFetch from "./anno/@fetch";

// import "@picocss/pico/css/pico.classless.min.css"
import "./style.less";

import { weatherApi } from "./anno/@fetch";

function myRemarkPlugin() {
  return (tree) => {

    visitParents(tree, "textDirective", async (node, ancestors) => {
      // 注册@abbr
      registerAnnoAbbr(node);

      // 判断祖先元素
      if (!ancestors || ancestors.length === 0) {
        return;
      }

      // 注册@nice
      registerAnnoNice(node, ancestors);

      // 注册@fetch
      await registerAnnoFetch(node, ancestors);
      
    });
  };
}

const App = {
  template: `
    <div>

    <p>演示注解:  @abbr + @nice + @fetch</p>
  
    <div class="grid">

    <textarea style="width:100%;min-height: 300px;display: inline-block;" v-model="before"></textarea>
    <div v-html="after"></div>
   
    </div>
</div>

 

  
    
  `,
  setup() {
    const before = ref(`# A lovely language know as @abbr[namespace](HTML, "HTML的全称"){.red #id} @nice

@abbr(HTML, "HTML的全称"){.bg-blue}

hello @nice
  
@nice hello

hello hi @nice @nice

hello hi *em* @abbr(HTML, "HTML的全称"){.bg-blue} @nice @nice

hello @nice @nice hi

@fetch("${weatherApi}")

@fetch{weather}

`);

    const after = ref("");

    watch(before, async () => {
      const res = await unified()
        .use(remarkParse)
        .use(remarkDirective)
        .use(myRemarkPlugin)
        .use(remarkRehype)
        .use(rehypeFormat)
        .use(rehypeStringify)
        .process(before.value);

      console.log(String(res));
      after.value = String(res);
    }, 
    {
      immediate: true,
      deep: true
    });

    return {
      before,
      after,
      weatherApi
    };
  },
};

Vue.use(VueCompositionApi);

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  render: (h) => h(App),
});
