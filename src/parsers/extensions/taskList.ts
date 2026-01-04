import { Token } from 'mdast-util-from-markdown';
import { factorySpace } from 'micromark-factory-space';
import { markdownLineEndingOrSpace, markdownSpace } from 'micromark-util-character';
import { codes, types } from 'micromark-util-symbol';
import { Effects, Extension, State } from 'micromark-util-types';

const tasklistCheck = { tokenize: tokenizeTasklistCheck };

export const gfmTaskListItem: Extension = {
  text: { [codes.leftSquareBracket]: tasklistCheck },
};

function tokenizeTasklistCheck(effects: Effects, ok: State, nok: State) {
  const open = (code: number) => {
    if (
      // Exit if there’s stuff before.
      this.previous !== codes.eof ||
      // Exit if not in the first content that is the first child of a list
      // item.
      !this._gfmTasklistFirstContentOfListItem
    ) {
      return nok(code);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    effects.enter('taskListCheck' as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    effects.enter('taskListCheckMarker' as any);
    effects.consume(code);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    effects.exit('taskListCheckMarker' as any);
    return inside;
  };

  /** @type {State} */
  const inside = (code: number) => {
    if (markdownSpace(code)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      effects.enter('taskListCheckValueUnchecked' as any);
      effects.consume(code);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      effects.exit('taskListCheckValueUnchecked' as any);
      return close;
    }

    if (code !== codes.rightSquareBracket) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      effects.enter('taskListCheckValueChecked' as any);
      effects.consume(code);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      effects.exit('taskListCheckValueChecked' as any);
      return close;
    }

    return nok(code);
  };

  /** @type {State} */
  const close = (code: number) => {
    if (code === codes.rightSquareBracket) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      effects.enter('taskListCheckMarker' as any);
      effects.consume(code);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      effects.exit('taskListCheckMarker' as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      effects.exit('taskListCheck' as any);
      return effects.check({ tokenize: spaceThenNonSpace }, ok, nok);
    }

    return nok(code);
  };

  return open;
}

/** @type {Tokenizer} */
function spaceThenNonSpace(effects: Effects, ok: State, nok: State) {
  const after = (code: number) => {
    const tail = this.events[this.events.length - 1];

    return tail &&
      tail[1].type === types.whitespace &&
      code !== codes.eof &&
      !markdownLineEndingOrSpace(code)
      ? ok(code)
      : nok(code);
  };

  return factorySpace(effects, after, types.whitespace);
}

/** @type {FromMarkdownExtension} */
export const gfmTaskListItemFromMarkdown = {
  exit: {
    taskListCheckValueChecked: exitCheck,
    taskListCheckValueUnchecked: exitCheck,
    paragraph: exitParagraphWithTaskListItem,
  },
};

/** @type {FromMarkdownHandle} */
function exitCheck(token: Token) {
  const node = /** @type {ListItem} */ this.stack[this.stack.length - 2];
  // We’re always in a paragraph, in a list item.
  node.checked = token.type === ('taskListCheckValueChecked' as string);
  node.checkChar = this.sliceSerialize(token);
}

/** @type {FromMarkdownHandle} */
function exitParagraphWithTaskListItem(token: Token) {
  const parent = /** @type {Parent} */ this.stack[this.stack.length - 2];
  const node = /** @type {Paragraph} */ this.stack[this.stack.length - 1];
  const siblings = parent.children;
  const head = node.children[0];
  let index = -1;
  /** @type {Paragraph|undefined} */
  let firstParaghraph;

  if (
    parent &&
    parent.type === 'listItem' &&
    typeof parent.checked === 'boolean' &&
    head &&
    head.type === 'text'
  ) {
    while (++index < siblings.length) {
      const sibling = siblings[index];
      if (sibling.type === 'paragraph') {
        firstParaghraph = sibling;
        break;
      }
    }

    if (firstParaghraph === node) {
      // Must start with a space or a tab.
      head.value = head.value.slice(1);

      if (head.value.length === 0) {
        node.children.shift();
      } else if (node.position && head.position && typeof head.position.start.offset === 'number') {
        head.position.start.column++;
        head.position.start.offset++;
        node.position.start = Object.assign({}, head.position.start);
      }
    }
  }

  this.exit(token);
}
