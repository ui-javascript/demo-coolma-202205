// import {directive, directiveHtml} from 'micromark-extension-directive'
import { directive } from "coolma";
import {
  directiveToMarkdown,
  directiveFromMarkdown,
} from "./mdastDirective";

export default function remarkDirective() {
    const data = this.data();
  
    add("micromarkExtensions", directive());
    add("fromMarkdownExtensions", directiveFromMarkdown);
    add("toMarkdownExtensions", directiveToMarkdown);
  
    /**
     * @param {string} field
     * @param {unknown} value
     */
    function add(field, value) {
      const list /** @type {unknown[]} */ =
        // Other extensions
        /* c8 ignore next 2 */
        data[field] ? data[field] : (data[field] = []);
  
      list.push(value);
    }
  }
  
  