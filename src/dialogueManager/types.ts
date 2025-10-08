interface DialogueOption {
  text: string;
  target: string;
  conditions?: Record<string, string>;
  actions?: string;
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
  START_QUEST = 'startQuest',
  UPDATE_QUEST = 'updateQuest',
  COMPLETE_QUEST = 'completeQuest',
  GIVE_ITEM = 'giveItem',
  TAKE_ITEM = 'takeItem',
}

enum DialogueConditionType {
  QUEST_ACTIVE = 'questActive',
  QUEST_COMPLETED = 'questCompleted',
  HAVE_ITEM = 'haveItem',
}

export {
  DialogueOption,
  DialogueNode,
  DialogueKey,
  DialogueGraph,
  DialogueActionType,
  DialogueConditionType,
};
