import { visitParents } from "unist-util-visit-parents";
import { initAliasMeta, registerAnno } from "./utils";
import aliasJsonConfigModules from "../annoAlias.config.json"

import aliasModules from "../anno/**/alias/@*.js";
import annoModules from "../anno/@*/index*.js";

export default function myRemarkPlugin() {
    const annoAlias = {}
  
    // 获取别名注册文件
    Object.keys(aliasModules).forEach((key) => {
      initAliasMeta(annoAlias, aliasModules[key].default.attachAnno, aliasModules[key].default.namespace, aliasModules[key].default.properties)
    });
  
    // 获取JSON配置文件
    Object.keys(aliasJsonConfigModules).forEach((key) => {
      initAliasMeta(annoAlias, aliasJsonConfigModules[key].attachAnno, key, aliasJsonConfigModules[key].properties)
    });
  
  
    return (tree) => {
  
      visitParents(tree, "textDirective", (node, ancestors) => {
        
        console.log("树节点")
        console.log(tree)

        Object.keys(annoModules).forEach((key) => {
          registerAnno(annoModules[key].default, annoAlias, node, ancestors)
        });
        
      });
  
    };
  }


