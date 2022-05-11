import Axios from "axios";
import { renderVoidElement } from "../../utils/utils";
import { h } from "hastscript";
import { nanoid } from "nanoid";

const registerAnnoFetch = async (node, ancestors) => {

  if (
    (!node.attributes || !("weather" in node.attributes)) &&
    (!node.args || node.args.length === 0)
  ) {
    renderVoidElement(node);
    return;
  }

  let api = null;
  if (
    node.attributes &&
    "weather" in node.attributes &&
    node.attributes.weather != "false"
  ) {
    api = weatherApi;
  }
  if (node.args && node.args[0]) {
    api = node.args[0];
  }

  const isWeatherApi = api === weatherApi;

  if (!api) {
    renderVoidElement(node);
    return;
  }

  // console.log("天气接口")
  // console.log()

  const tableId = nanoid();
  const loadingDivId = nanoid();
  const tableTitleId = nanoid();

  const data = node.data || (node.data = {});
  const hast = h(
    `div#${loadingDivId}`,
    { "aria-busy": "true", style: "width: 100%;min-height: 50px;" },
    // @todo 耦合代码
    [h('figure', {}, [
    isWeatherApi 
      ? [
        h(`table#${tableId}`, { role: "grid" }, []),
        h(`h6#${tableTitleId}`, { class: "text-center" }, ""),
      ] 
      : [h(`table#${tableId}`, { role: "grid" }, [])]
    ])]
  );

  data.hName = hast.tagName;
  data.hProperties = hast.properties;
  data.hChildren = hast.children;

  const res = await Axios.get(api);

  let resData;
  if (res.data) {
    if (res.data.data) {
      resData = res.data.data;
    } else {
      resData = res.data;
    }
  } else {
    resData = res;
  }

  let includeKeys = node.attributes["includeKeys"];

  // @todo 耦合代码
  if (isWeatherApi && !includeKeys) {
    includeKeys = ["day", "date", "week", "wea"];
  }

  const table = document.getElementById(tableId);
  const thead = document.createElement("thead");
  const tr = document.createElement("tr");
  for (let key in resData[0]) {
    if (includeKeys && !includeKeys.includes("*") && !includeKeys.includes(key)) {
      continue;
    }
    const th = document.createElement("th");
    th.innerText = key;
    tr.appendChild(th);
  }
  thead.appendChild(tr);

  const tbody = document.createElement("tbody");
  for (let i = 0; i < resData.length; i++) {
    const tr = document.createElement("tr");
    for (let key in resData[i]) {
      if (includeKeys && !includeKeys.includes("*") && !includeKeys.includes(key)) {
        continue;
      }
      const td = document.createElement("td");
      td.innerText = JSON.stringify(resData[i][key]);
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }

  table.appendChild(thead);
  table.appendChild(tbody);

  let loadingDiv = document.getElementById(loadingDivId);
  loadingDiv.setAttribute("aria-busy", false);

  // @todo 耦合代码
  if (isWeatherApi) {
    let tableTitle = document.getElementById(tableTitleId);
    tableTitle.innerText = `(${res.data.city}-未来一周天气表)`;
  }
};

export default registerAnnoFetch;

export const weatherApi =
  "https://v0.yiketianqi.com/api?unescape=1&version=v91&appid=43656176&appsecret=I42og6Lm&ext=&cityid=&city=";
