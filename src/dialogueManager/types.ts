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

type DialogueGraph = Record<string, DialogueNode>;

enum DialogueKey {
  INNKEEPER = 'innkeeper',
}

enum DialogueActionType {
  TRADE = 'trade',
  END = 'end',
  QUEST_START = 'questStart',
  QUEST_UPDATE = 'questUpdate',
  COMPLETE_QUEST = 'completeQuest',
  GIVE_ITEM = 'giveItem',
}

export {
  DialogueOption,
  DialogueNode,
  DialogueKey,
  DialogueGraph,
  DialogueActionType,
};
