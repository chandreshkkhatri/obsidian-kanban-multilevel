import { Token } from 'mdast-util-from-markdown';

export function internalMarkdownLinks(
  process: (node: Record<string, unknown>, isEmbed: boolean) => void
) {
  function exitLink(token: Token) {
    process(this.stack[this.stack.length - 1] as Record<string, unknown>, false);
    this.exit(token);
  }

  function exitImage(token: Token) {
    process(this.stack[this.stack.length - 1] as Record<string, unknown>, true);
    this.exit(token);
  }

  return {
    exit: {
      link: exitLink,
      image: exitImage,
    },
  };
}
