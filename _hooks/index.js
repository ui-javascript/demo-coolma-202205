import Vue from 'vue'

import VueCompositionApi, {computed, reactive, ref } from '@vue/composition-api';
Vue.use(VueCompositionApi);

import { useDateNow } from "vue-composable";
import { usePagination } from "vue-composable";


const App = {
  template: `
    <div>
        <p>page {{ currentPage }} of {{ lastPage }}</p>
        <p>
          <button @click="prev">prev</button>
          <button @click="next">next</button>
        </p>
        <ul>
          <li v-for="n in result" :key="n">{{ n }}</li>
        </ul>
      
      <button @click="increment">
        count is: {{ state.count }},
        double is: {{ state.double }},
        {{ now }}

 
      </button>
      
    </div>
    
  `,
  setup() {
    const state = reactive({
      count: 0,
      double: computed(() => state.count * 2)
    })

    const { now } = useDateNow();

    function increment() {
      state.count++
    }



    const arrayRef = ref(new Array(100).fill(1).map((_, i) => i));
    // paginate array
    const {
      currentPage,
      lastPage,
      next,
      prev,
      offset,
      pageSize
    } = usePagination({
      currentPage: 1,
      pageSize: 10,
      total: computed(() => arrayRef.value.length)
    });

    const result = computed(() => {
      const array = arrayRef.value;
      if (!Array.isArray(array)) return [];
      return array.slice(offset.value, offset.value + pageSize.value);
    });


    return {
      state,
      increment,
      now,

      currentPage,
      lastPage,
      next,
      prev,
      result
    }
  }
}

Vue.config.productionTip = false


new Vue({
  el: '#app',
  render: h => h(App)
})
