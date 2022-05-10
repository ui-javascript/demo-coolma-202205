import Axios from "axios";
import { renderVoidElement } from "../utils/utils";

const registerAnnoFetch = async (node, ancestors) => {

    if (node.name !== "fetch") {
        return;
    }

    console.log()

    if ((!node.args || node.args.length === 0) && (!node.attributes || 'weather' in node.attributes)) {
        renderVoidElement(node)
        return;
    }


    // console.log("天气接口")
    // console.log()

    const res = await Axios.get(node.args[0])
    console.log(res)



}

export default registerAnnoFetch; 