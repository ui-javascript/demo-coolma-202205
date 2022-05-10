import Axios from "axios";
import { renderVoidElement } from "../utils/utils";
import { h } from "hastscript";
import { nanoid } from 'nanoid';



const registerAnnoFetch = async (annoAlias, node, ancestors) => {
    
  
    let aliasAttributes = null

    if (node.name !== "fetch") {
        let isOk = false
        for (let key in annoAlias['fetch']) {
            if (key === node.name) {
                isOk = true
                aliasAttributes = annoAlias['fetch'][key]
                break
            }
        }

        if (!isOk) {
            return;
        }
    }

    if (aliasAttributes) {
        node.attributes = Object.assign(node.attributes || {}, aliasAttributes)
    }

    if ((!node.attributes || !('weather' in node.attributes)) && (!node.args || node.args.length === 0)) {
        renderVoidElement(node)
        return;
    }

    let api = null
    if (node.attributes && 'weather' in node.attributes && (node.attributes.weather != 'false')) {
        api = weatherApi
    }
    if (node.args && node.args[0]) {
        api = node.args[0]
    } 

    const isWeatherApi = api === weatherApi

    if (!api) {
        renderVoidElement(node)
        return;
    }


    // console.log("天气接口")
    // console.log()

    const tableId = nanoid()
    const loadingDivId = nanoid()
    const tableTitleId = nanoid()
  
    const data = node.data || (node.data = {});
    const hast = h(`div#${loadingDivId}`, { 'aria-busy': 'true', style: "width: 100%;min-height: 50px;"}, 
        isWeatherApi ? [h(`table#${tableId}`, {role: 'grid'}, []), h(`h6#${tableTitleId}`, {class: "text-center"}, "")]
            : [h(`table#${tableId}`, {role: 'grid'}, [])]
    )

    data.hName = hast.tagName;
    data.hProperties = hast.properties;
    data.hChildren = hast.children;

  
    const res = await Axios.get(api)
    console.log(res.data.data)

    let includeKeys = node.attributes['includeKeys']
    if (isWeatherApi && !includeKeys) {
        includeKeys = ['day', 'date', 'week']
    }

    const table = document.getElementById(tableId)
    const thead = document.createElement("thead") 
    const tr = document.createElement("tr")
    for (let key in res.data.data[0]) {
        if (includeKeys && !includeKeys.includes(key)) {
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
            if (includeKeys && !includeKeys.includes(key)) {
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

    let loadingDiv = document.getElementById(loadingDivId)
    loadingDiv.setAttribute('aria-busy', false)

    if (isWeatherApi) {
        let tableTitle = document.getElementById(tableTitleId)
        tableTitle.innerText = `(${res.data.city}-未来一周天气表)`
    }
}

export default registerAnnoFetch; 

export const weatherApi = "https://v0.yiketianqi.com/api?unescape=1&version=v91&appid=43656176&appsecret=I42og6Lm&ext=&cityid=&city="