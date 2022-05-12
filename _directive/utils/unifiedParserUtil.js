import myRemarkPlugin from "./myRemarkPlugin"
import { unified } from "unified";

import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkDirective from "./remarkDirective";

export default function unifiedParser(content) {
    return unified()
    .use(remarkParse)
    .use(remarkDirective)
    .use(myRemarkPlugin)
    .use(remarkRehype)
    .use(rehypeFormat)
    .use(rehypeStringify)
    .process(content)
}