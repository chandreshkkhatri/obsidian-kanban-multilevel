import { Extension as FromMarkdownExtension, Token } from 'mdast-util-from-markdown';
import { markdownLineEnding, markdownLineEndingOrSpace } from 'micromark-util-character';
import { Effects, Extension, State, TokenType } from 'micromark-util-types';

import { getSelf } from './helpers';

export function genericWrappedExtension(
  name: string,
  startMarker: string,
  endMarker: string
): Extension {
  function tokenize(effects: Effects, ok: State, nok: State) {
    let data = false;
    let startMarkerCursor = 0;
    let endMarkerCursor = 0;

    return start;

    function start(code: number) {
      if (code !== startMarker.charCodeAt(startMarkerCursor)) return nok(code);

      effects.enter(name as TokenType);
      effects.enter(`${name}Marker` as TokenType);

      return consumeStart(code);
    }

    function consumeStart(code: number) {
      if (startMarkerCursor === startMarker.length) {
        effects.exit(`${name}Marker` as TokenType);
        return consumeData(code);
      }

      if (code !== startMarker.charCodeAt(startMarkerCursor)) {
        return nok(code);
      }

      effects.consume(code);
      startMarkerCursor++;

      return consumeStart;
    }

    function consumeData(code: number) {
      if (markdownLineEnding(code) || code === null) {
        return nok(code);
      }

      effects.enter(`${name}Data` as TokenType);
      effects.enter(`${name}Target` as TokenType);
      return consumeTarget(code);
    }

    function consumeTarget(code: number) {
      if (code === endMarker.charCodeAt(endMarkerCursor)) {
        if (!data) return nok(code);
        effects.exit(`${name}Target` as TokenType);
        effects.exit(`${name}Data` as TokenType);
        effects.enter(`${name}Marker` as TokenType);
        return consumeEnd(code);
      }

      if (markdownLineEnding(code) || code === null) {
        return nok(code);
      }

      if (!markdownLineEndingOrSpace(code)) {
        data = true;
      }

      effects.consume(code);

      return consumeTarget;
    }

    function consumeEnd(code: number) {
      if (endMarkerCursor === endMarker.length) {
        effects.exit(`${name}Marker` as TokenType);
        effects.exit(name as TokenType);
        return ok(code);
      }

      if (code !== endMarker.charCodeAt(endMarkerCursor)) {
        return nok(code);
      }

      effects.consume(code);
      endMarkerCursor++;

      return consumeEnd;
    }
  }

  const call = { tokenize: tokenize };

  return {
    text: { [startMarker.charCodeAt(0)]: call },
  };
}

export function genericWrappedFromMarkdown(
  name: string,
  process?: (str: string, curr: Record<string, unknown>) => void
): FromMarkdownExtension {
  function enterWrapped(token: Token) {
    this.enter(
      {
        type: name,
        value: null,
      },
      token
    );
  }

  function exitWrappedTarget(token: Token) {
    const target = this.sliceSerialize(token);
    const current = getSelf(this.stack);

    (current as Record<string, unknown>).value = target;

    if (process) {
      process(target, current as Record<string, unknown>);
    }
  }

  function exitWrapped(token: Token) {
    this.exit(token);
  }

  return {
    enter: {
      [name]: enterWrapped,
    },
    exit: {
      [`${name}Target`]: exitWrappedTarget,
      [name]: exitWrapped,
    },
  };
}
