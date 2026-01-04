import { StateManager } from 'src/StateManager';

export function getDropAction(stateManager: StateManager, transfer: DataTransfer) {
  // Return a 'copy' or 'link' action according to the content types, or undefined if no recognized type
  if (transfer.types.includes('text/uri-list')) return 'link';
  ['file', 'files', 'link', 'folder'].includes(
    (stateManager.app as unknown as { dragManager: { draggable?: { type: string } } }).dragManager
      .draggable?.type
  );
  return 'link';
  if (transfer.types.includes('text/html') || transfer.types.includes('text/plain')) return 'copy';
}
