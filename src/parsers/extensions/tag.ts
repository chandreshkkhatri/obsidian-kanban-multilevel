/* eslint-disable @typescript-eslint/no-explicit-any -- micromark extensions use 'any' for tokens and states */
import { Extension as FromMarkdownExtension, Token } from 'mdast-util-from-markdown';
import { markdownLineEndingOrSpace } from 'micromark-util-character';
import { Effects, Extension, State } from 'micromark-util-types';

import { getSelf } from './helpers';

export function tagExtension(): Extension {
  const name = 'hashtag';
  const hashCharCode = '#'.charCodeAt(0);

  function tokenize(effects: Effects, ok: State, nok: State) {
    let data = false;
    let startMarkerCursor = 0;

    const start = (code: number) => {
      if (
        code !== hashCharCode ||
        (this.previous !== null && !/\s/.test(String.fromCharCode(this.previous)))
      ) {
        return nok(code);
      }

      effects.enter(name as any);
      effects.enter(`${name}Marker` as any);

      return consumeStart(code);
    };

    const consumeStart = (code: number): State => {
      if (startMarkerCursor === 1) {
        effects.exit(`${name}Marker` as any);
        return consumeData(code);
      }

      if (code !== hashCharCode) {
        return nok(code);
      }

      effects.consume(code);
      startMarkerCursor++;

      return consumeStart;
    };

    const consumeData = (code: number) => {
      effects.enter(`${name}Data` as any);
      effects.enter(`${name}Target` as any);
      return consumeTarget(code);
    };

    const consumeTarget = (code: number): State => {
      if (
        code === null ||
        markdownLineEndingOrSpace(code) ||
        /[\u2000-\u206F\u2E00-\u2E7F'!"#$%&()*+,.:;<=>?@^`{|}~[\]\\\s\n\r]/.test(
          String.fromCharCode(code)
        )
      ) {
        if (!data) return nok(code);
        effects.exit(`${name}Target` as any);
        effects.exit(`${name}Data` as any);
        effects.exit(name as any);

        return ok(code);
      }

      data = true;
      effects.consume(code);

      return consumeTarget;
    };

    return start;
  }

  const call = { tokenize: tokenize };

  return {
    text: { [hashCharCode]: call },
  };
}

export function tagFromMarkdown(): FromMarkdownExtension {
  const name = 'hashtag';

  function enterTag(token: Token) {
    this.enter(
      {
        type: name,
        value: null,
      },
      token
    );
  }

  function exitTagTarget(token: Token) {
    const target = this.sliceSerialize(token);
    const current = getSelf(this.stack);

    (current as any).value = target;
  }

  function exitTag(token: Token) {
    this.exit(token);
  }

  return {
    enter: {
      [name]: enterTag,
    },
    exit: {
      [`${name}Target`]: exitTagTarget,
      [name]: exitTag,
    },
  };
}
