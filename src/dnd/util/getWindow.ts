export function getParentWindow(el: Element) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Obsidian-specific property
  return (el as any).win;
}

export function getParentBodyElement(el: Element) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Obsidian-specific property
  return (el as any).doc.body;
}
