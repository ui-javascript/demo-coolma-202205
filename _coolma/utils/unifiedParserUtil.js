import myRemarkPlugin from "./myRemarkPlugin"
import { unified } from "unified";

import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkDirective from "./remarkDirective";
import remarkGfm from 'remark-gfm'
// import remarkToc from 'remark-toc'
// import rehypeHighlight from 'rehype-highlight'
import rehypePrism from 'rehype-prism-plus'
// import remarkLintListItemIndent from 'remark-lint-list-item-indent'

export default function unifiedParser(content) {
    return unified()
    .use(remarkParse)
    // .use(remarkToc, {
    //     heading: 'contents',
    //     tight: true, 
    //     ordered: true
    // })
    .use(remarkDirective)
    .use(myRemarkPlugin)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeFormat)
    // .use(remarkLintListItemIndent)
    .use(rehypeStringify, {
        // @adjust https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
        listItemIndent: "tab"
    })

    // .use(rehypeHighlight)
    .use(rehypePrism)
    .process(content)
}