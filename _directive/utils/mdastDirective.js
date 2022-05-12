import { parseEntities } from "parse-entities";
import { stringifyEntitiesLight } from "stringify-entities";
import { visitParents } from "unist-util-visit-parents";
import { containerFlow } from "mdast-util-to-markdown/lib/util/container-flow.js";
import { containerPhrasing } from "mdast-util-to-markdown/lib/util/container-phrasing.js";
import { checkQuote } from "mdast-util-to-markdown/lib/util/check-quote.js";
import { track } from "mdast-util-to-markdown/lib/util/track.js";

const own = {}.hasOwnProperty;

const shortcut = /^\(^\t\n\r "#'.<=>`}]+$/;

handleDirective.peek = peekDirective;

/** @type {FromMarkdownExtension} */
export const directiveFromMarkdown = {
  canContainEols: ["textDirective"],
  enter: {
    directiveContainer: enterContainer,
    directiveContainerAttributes: enterAttributes,
    directiveContainerArgs: enterContainerArgs,

    directiveLeaf: enterLeaf,
    directiveLeafAttributes: enterAttributes,

    directiveText: enterText,
    directiveTextAttributes: enterAttributes,
    directiveTextNamespace: enterNamespace,
    directiveTextArgs: enterArgs,
  },
  exit: {
    directiveContainer: exit,
    directiveContainerAttributeClassValue: exitAttributeClassValue,
    directiveContainerAttributeIdValue: exitAttributeIdValue,
    directiveContainerAttributeName: exitAttributeName,
    directiveContainerAttributeValue: exitAttributeValue,
    directiveContainerAttributes: exitAttributes,
    directiveContainerArgValueData: exitArgValueData,
    directiveContainerArgs: exitArgs,
    directiveContainerName: exitName,
    directiveContainerNamespace: exitNamespace,

    directiveLeaf: exit,
    directiveLeafAttributeClassValue: exitAttributeClassValue,
    directiveLeafAttributeIdValue: exitAttributeIdValue,
    directiveLeafAttributeName: exitAttributeName,
    directiveLeafAttributeValue: exitAttributeValue,
    directiveLeafAttributes: exitAttributes,
    directiveLeafArgValueData: exitArgValueData,
    directiveLeafArgs: exitArgs,
    directiveLeafName: exitName,
    directiveLeafNamespace: exitNamespace,

    directiveText: exit,
    directiveTextAttributeClassValue: exitAttributeClassValue,
    directiveTextAttributeIdValue: exitAttributeIdValue,
    directiveTextAttributeName: exitAttributeName,
    directiveTextAttributeValue: exitAttributeValue,
    directiveTextAttributes: exitAttributes,

    directiveTextArgValueData: exitArgValueData,
    directiveTextArgs: exitArgs,
    directiveTextName: exitName,
    directiveTextNamespace: exitNamespace,
  },
};

/** @type {ToMarkdownExtension} */
export const directiveToMarkdown = {
  unsafe: [
    {
      character: "\r",
      inConstruct: ["leafDirectiveArgs", "containerDirectiveArgs"],
    },
    {
      character: "\n",
      inConstruct: ["leafDirectiveArgs", "containerDirectiveArgs"],
    },
    {
      before: "[^@]",
      character: "@",
      after: "[A-Za-z]",
      inConstruct: ["phrasing"],
    },
    { atBreak: true, character: "@", after: "@" },
  ],
  handlers: {
    containerDirective: handleDirective,
    leafDirective: handleDirective,
    textDirective: handleDirective,
  },
};

/** @type {FromMarkdownHandle} */
function enterContainer(token) {
  enter.call(this, "containerDirective", token);
}

/** @type {FromMarkdownHandle} */
function enterLeaf(token) {
  enter.call(this, "leafDirective", token);
}

/** @type {FromMarkdownHandle} */
function enterText(token) {
  enter.call(this, "textDirective", token);
}

/**
 * @this {CompileContext}
 * @param {Directive['type']} type
 * @param {Token} token
 */
function enter(type, token) {
  this.enter(
    { type, name: "", namespace: "", attributes: {}, args: [], children: [] },
    token
  );
}

/** @type {_Handle} */
function exitArgValueData(token) {
  /** @type {Args} */
  // @ts-expect-error
  let args = this.getData("directiveArgs");
  console.log("===");
  // console.log(this.sliceSerialize(token))

  console.log(token);
  // console.log(this.sliceSerialize(token))
  // console.log(parseEntities(this.sliceSerialize(token)))
  args.push(this.sliceSerialize(token));
}

/**
 * @this {CompileContext}
 * @param {Token} token
 */
function exitName(token) {
  const node = /** @type {Directive} */ (this.stack[this.stack.length - 1]);
  node.name = this.sliceSerialize(token);
}

/** @type {FromMarkdownHandle} */
function enterContainerArgs(token) {
  console.log(token);
  this.enter(
    { type: "paragraph", data: { directiveArgs: true }, children: [] },
    token
  );
}

/** @type {FromMarkdownHandle} */
function exitContainerArgs(token) {
  this.exit(token);
}

/** @type {FromMarkdownHandle} */
function enterAttributes() {
  this.setData("directiveAttributes", []);
  this.buffer(); // Capture EOLs
}

/** @type {FromMarkdownHandle} */
function exitAttributeIdValue(token) {
  const list = /** @type {Array.<[string, string]>} */ (this.getData(
    "directiveAttributes"
  ));
  list.push(["id", parseEntities(this.sliceSerialize(token))]);
}

/** @type {FromMarkdownHandle} */
function exitAttributeClassValue(token) {
  const list = /** @type {Array.<[string, string]>} */ (this.getData(
    "directiveAttributes"
  ));
  list.push(["class", parseEntities(this.sliceSerialize(token))]);
}

/** @type {FromMarkdownHandle} */
function exitAttributeValue(token) {
  const list = /** @type {Array.<[string, string]>} */ (this.getData(
    "directiveAttributes"
  ));
  list[list.length - 1][1] = parseEntities(this.sliceSerialize(token));
}

/** @type {FromMarkdownHandle} */
function exitAttributeName(token) {
  const list = /** @type {Array.<[string, string]>} */ (this.getData(
    "directiveAttributes"
  ));

  // Attribute names in CommonMark are significantly limited, so character
  // references can’t exist.
  list.push([this.sliceSerialize(token), ""]);
}

/** @type {FromMarkdownHandle} */
function exitAttributes() {
  const list = /** @type {Array.<[string, string]>} */ (this.getData(
    "directiveAttributes"
  ));
  /** @type {Record.<string, string>} */
  const cleaned = {};
  let index = -1;

  while (++index < list.length) {
    const attribute = list[index];

    if (attribute[0] === "class" && cleaned.class) {
      cleaned.class += " " + attribute[1];
    } else {
      cleaned[attribute[0]] = attribute[1];
    }
  }

  this.setData("directiveAttributes");
  this.resume(); // Drop EOLs
  const node = /** @type {Directive} */ (this.stack[this.stack.length - 1]);
  node.attributes = cleaned;
}

/** @type {FromMarkdownHandle} */
function exit(token) {
  this.exit(token);
}

/**
 * @type {ToMarkdownHandle}
 * @param {Directive} node
 */
function handleDirective(node, _, context, safeOptions) {
  const tracker = track(safeOptions);
  const sequence = fence(node);
  const exit = context.enter(node.type);
  let value = tracker.move(sequence + (node.name || ""));
  /** @type {Directive|Paragraph|undefined} */
  let label = node;

  // console.log("node");
  // console.log(node);

  

  if (node.type === "containerDirective") {
    const head = (node.children || [])[0];
    label = inlineDirectiveArgs(head) ? head : undefined;
  }

  // label.children = label.args
  if (label && label.args && label.args.length > 0) {
    const exit = context.enter("args");
    const subexit = context.enter(node.type + "Args");
    console.log("进入");
    value += tracker.move("(");
    if (node.type === "textDirective") { // @fix @todo
      value += tracker.move("'" + label.args.join("','") + "'")
    } else {
      value += tracker.move(
        containerPhrasing(label, context, {
          ...tracker.current(),
          before: value,
          after: ")",
        })
      );
    }
 
    value += tracker.move(")");
    subexit();
    exit();
  }

  value += tracker.move(attributes(node, context));

  // if (node.type === "containerDirective") {
  //   const head = (node.children || [])[0];
  //   let shallow = node;

  //   if (inlineDirectiveArgs(head)) {
  //     shallow = Object.assign({}, node, {
  //       // args: node.children.slice(1),
  //       children: node.children.slice(1),
  //     });
  //   }

  //   if (shallow && shallow.children && shallow.children.length > 0) {
  //     value += tracker.move("\n");
  //     value += tracker.move(containerFlow(shallow, context, tracker.current()));
  //   }

  //   value += tracker.move("\n" + sequence);
  // }

  exit();
  
  console.log("处理Arg")
  console.log(value)
  return value;
}

/** @type {ToMarkdownHandle} */
function peekDirective() {
  return "@";
}

/**
 * @param {Directive} node
 * @param {Context} context
 * @returns {string}
 */
function attributes(node, context) {
  const quote = checkQuote(context);
  const subset = node.type === "textDirective" ? [quote] : [quote, "\n", "\r"];
  const attrs = node.attributes || {};
  /** @type {Array.<string>} */
  const values = [];
  /** @type {string|undefined} */
  let classesFull;
  /** @type {string|undefined} */
  let classes;
  /** @type {string|undefined} */
  let id;
  /** @type {string} */
  let key;

  for (key in attrs) {
    if (
      own.call(attrs, key) &&
      attrs[key] !== undefined &&
      attrs[key] !== null
    ) {
      const value = String(attrs[key]);

      if (key === "id") {
        id = shortcut.test(value) ? "#" + value : quoted("id", value);
      } else if (key === "class") {
        const list = value.split(/[\t\n\r ]+/g);
        /** @type {Array.<string>} */
        const classesFullList = [];
        /** @type {Array.<string>} */
        const classesList = [];
        let index = -1;

        while (++index < list.length) {
          (shortcut.test(list[index]) ? classesList : classesFullList).push(
            list[index]
          );
        }

        classesFull =
          classesFullList.length > 0
            ? quoted("class", classesFullList.join(" "))
            : "";
        classes = classesList.length > 0 ? "." + classesList.join(".") : "";
      } else {
        values.push(quoted(key, value));
      }
    }
  }

  if (classesFull) {
    values.unshift(classesFull);
  }

  if (classes) {
    values.unshift(classes);
  }

  if (id) {
    values.unshift(id);
  }

  return values.length > 0 ? "{" + values.join(" ") + "}" : "";

  /**
   * @param {string} key
   * @param {string} value
   * @returns {string}
   */
  function quoted(key, value) {
    return (
      key +
      (value
        ? "=" + quote + stringifyEntitiesLight(value, { subset }) + quote
        : "")
    );
  }
}

/**
 * @param {BlockContent} node
 * @returns {node is Paragraph & {data: {directiveArgs: boolean}}}
 */
function inlineDirectiveArgs(node) {
  console.log("参数指令");
  console.log(node);
  return Boolean(
    node && node.type === "paragraph" && node.data && node.data.directiveArgs
  );
}

/** @type {_Handle} */
function enterArgs() {
  this.buffer();
  this.setData("directiveArgs", []);
}

/** @type {_Handle} */
function exitArgs() {
  /** @type {Directive[]} */
  // @ts-expect-error
  // const stack = this.stack
  /** @type {Args} */
  // @ts-expect-error
  const args = this.getData("directiveArgs");
  /** @type {string[]} */
  const cleaned = [];
  /** @type {string} */
  let arg;
  let index = -1;

  console.log("==>");
  // console.log(stack)
  console.log(args);

  while (++index < args.length) {
    arg = args[index];

    cleaned.push(arg);
  }

  this.resume();
  this.setData("directiveArgs");
  
  this.stack[this.stack.length - 1].args = cleaned;
}

/** @type {_Handle} */
function enterNamespace() {
  this.buffer();
}

/** @type {_Handle} */
function exitNamespace() {
  const data = this.resume();
  
  // console.log("进入命名空间");
  // console.log(token);
  console.log(this.stack[this.stack.length - 1]);
  this.stack[this.stack.length - 1].namespace = data;

  
  // const node = /** @type {Directive} */ (this.stack[this.stack.length - 1]);
  // // console.log();
  // node.namespace = this.sliceSerialize(token);
}

/**
 * @param {Directive} node
 * @returns {string}
 */
function fence(node) {
  let size = 0;

  if (node.type === "containerDirective") {
    visitParents(node, "containerDirective", onvisit);
    size += 3;
  } else if (node.type === "leafDirective") {
    size = 2;
  } else {
    size = 1;
  }

  return "@".repeat(size);

  /** @type {import('unist-util-visit-parents/complex-types').BuildVisitor<Root, Directive>} */
  function onvisit(_, parents) {
    let index = parents.length;
    let nesting = 0;

    while (index--) {
      if (parents[index].type === "containerDirective") {
        nesting++;
      }
    }

    if (nesting > size) size = nesting;
  }
}
