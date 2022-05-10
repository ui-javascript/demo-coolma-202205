import Axios from "axios";
import { renderVoidElement } from "../utils/utils";
import { h } from "hastscript";
import { nanoid } from 'nanoid';



const registerAnnoFetch = async (node, ancestors) => {

    if (node.name !== "fetch") {
        return;
    }


    if ((!node.attributes || !('weather' in node.attributes)) && (!node.args || node.args.length === 0)) {
        renderVoidElement(node)
        return;
    }

    // console.log("天气接口")
    // console.log()

    const tableId = nanoid()
  
    const data = node.data || (node.data = {});
    const hast = h(`table#${tableId}`, [
        // h('thead', [
        //     h('th', ["天气"])
        // ]),
        // h('tbody', [
        //     h('td', ["xxx"])
        // ])
      ])

    data.hName = hast.tagName;
    data.hProperties = hast.properties;
    data.hChildren = hast.children;

    let api = null
    if (node.attributes && 'weather' in node.attributes) {
        api = weatherApi
    }
    if (node.args && node.args[0]) {
        api = node.args[0]
    } 


    if (!api) {
        renderVoidElement(node)
        return;
    }

    const res = await Axios.get(api)
    console.log(res.data.data)

    const table = document.getElementById(tableId)
    const thead = document.createElement("thead") 
    const tr = document.createElement("tr")
    for (let key in res.data.data[0]) {
        if (!['day', 'date', 'week'].includes(key)) {
            continue
        }
        const th = document.createElement("th")
        th.innerText = key
        tr.appendChild(th)        
    }
    thead.appendChild(tr)

    const tbody = document.createElement("tbody") 
    for (let i=0; i < res.data.data.length; i++) {
        const tr = document.createElement("tr")
        for (let key in res.data.data[i]) {
            if (!['day', 'date', 'week'].includes(key)) {
                continue
            }
            const td = document.createElement("td")
            td.innerText = JSON.stringify(res.data.data[i][key])
            tr.appendChild(td)
        }
        tbody.appendChild(tr)
    }

    table.appendChild(thead)
    table.appendChild(tbody)
}

export default registerAnnoFetch; 

export const weatherApi = "https://v0.yiketianqi.com/api?unescape=1&version=v91&appid=43656176&appsecret=I42og6Lm&ext=&cityid=&city="