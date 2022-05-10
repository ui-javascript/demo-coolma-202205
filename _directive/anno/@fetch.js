import { renderVoidElement } from "../utils/utils";

export default function registerAnnoFetch(node, ancestors) {

    if (node.name !== "fetch") {
        return;
    }

    console.log()

    if (!node.args || node.args.length === 0) {
        renderVoidElement(node)
        return;
    }

    debugger

    console.log("天气接口")
    console.log(node.args[0])

}