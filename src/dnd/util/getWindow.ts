interface ObsidianElement extends Element {
  win: Window;
  doc: Document;
}

export function getParentWindow(el: Element) {
  return (el as ObsidianElement).win;
}

export function getParentBodyElement(el: Element) {
  return (el as ObsidianElement).doc.body;
}
