// src/dialogueManager/types.ts
interface DialogueOption {
  text: string;
  target: string;
  conditions?: Record<string, string>;
  action?: string;
}

interface DialogueNode {
  id: string;
  text: string[];
  options: DialogueOption[];
  commands?: Record<string, string>;
}

enum DialogueKey {
  INNKEEPER = 'innkeeper',
}

export { DialogueOption, DialogueNode, DialogueKey };
