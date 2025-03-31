import { useState } from 'react';

export function useEditorHistory(initialContent: string) {
  const [undoStack, setUndoStack] = useState<string[]>([initialContent]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [currentPosition, setCurrentPosition] = useState(0);

  const saveToHistory = (content: string) => {
    if (content !== undoStack[currentPosition] && content !== '') {
      const newUndoStack = [...undoStack.slice(0, currentPosition + 1), content];
      setUndoStack(newUndoStack);
      setRedoStack([]);
      setCurrentPosition(newUndoStack.length - 1);
    }
  };

  const undo = () => {
    if (currentPosition > 0) {
      const newPosition = currentPosition - 1;
      setCurrentPosition(newPosition);

      const newRedoStack = [...redoStack, undoStack[currentPosition]];
      setRedoStack(newRedoStack);

      return undoStack[newPosition];
    }
    return null;
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const newContent = redoStack[redoStack.length - 1];

      const newUndoStack = [...undoStack, newContent];
      setUndoStack(newUndoStack);
      setRedoStack(redoStack.slice(0, -1));
      setCurrentPosition(newUndoStack.length - 1);

      return newContent;
    }
    return null;
  };

  return {
    saveToHistory,
    undo,
    redo,
    canUndo: currentPosition > 0,
    canRedo: redoStack.length > 0,
  };
}
