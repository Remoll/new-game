import DialogueManager from '@/dialogueManager/DialogueManager.ts';
import {
  DialogueActionType,
  DialogueGraph,
  DialogueKey,
  DialogueNode,
} from '@/dialogueManager/types.ts';
import GameState from '@/gameState/GameState.ts';
import DialogueUI from '@/ui/dialogueHandler/DialogueUI.ts';

class DialogueEngine {
  private static singleton: DialogueEngine | null = null;
  private currentDialogueGraph: DialogueGraph;
  private currentDialogueNode: DialogueNode;
  private dialogueUi: DialogueUI;

  private constructor() {
    this.dialogueUi = DialogueUI.getSingleton();
  }

  static getSingleton(): DialogueEngine {
    if (!DialogueEngine.singleton) {
      DialogueEngine.singleton = new DialogueEngine();
    }
    return DialogueEngine.singleton;
  }

  private endDialogue() {
    this.dialogueUi.closeDialogueContainer();
    GameState.setIsDialogueOpen(false);
  }

  private executeActionFromDialogue(action: string) {
    const actionParts = action.split(' ');
    const actionName = actionParts[0] as unknown as DialogueActionType;
    const actionAttributes = actionParts.slice(1, actionParts.length);

    switch (actionName) {
      case DialogueActionType.TRADE:
        console.log('hande trade');
        break;

      case DialogueActionType.END:
        this.endDialogue();
        break;

      case DialogueActionType.QUEST_START:
        console.log(`hande questStart: ${actionAttributes[0]}`);
        break;

      case DialogueActionType.QUEST_UPDATE:
        console.log(
          `hande questUpdate: ${actionAttributes[0]} stage: ${actionAttributes[1]}`
        );
        break;

      case DialogueActionType.COMPLETE_QUEST:
        console.log(`hande completeQuest: ${actionAttributes[0]}`);
        break;

      case DialogueActionType.GIVE_ITEM:
        console.log(
          `hande giveItem: ${actionAttributes[0]}, quantity: ${actionAttributes[1]}`
        );
        break;

      default:
        break;
    }
  }

  private filterActiveOptions() {}

  goToDialogueNode(selectedKey: number) {
    const optionIndex = selectedKey - 1;
    const selectedOption = this.currentDialogueNode.options[optionIndex];
    const action = selectedOption.action;

    if (action) {
      this.executeActionFromDialogue(action);
    }

    const nextNode = this.currentDialogueGraph[selectedOption.target];
    if (!nextNode) {
      return;
    }
    this.currentDialogueNode = nextNode;
    this.dialogueUi.fillDialogueUi(nextNode);
  }

  initDialogue(dialogueKey: DialogueKey) {
    this.currentDialogueGraph =
      DialogueManager.getSingleton().getDialogue(dialogueKey);

    this.currentDialogueNode = this.currentDialogueGraph.start;

    this.dialogueUi.fillDialogueUi(this.currentDialogueNode);
    this.dialogueUi.openDialogueContainer();
    GameState.setIsDialogueOpen(true);
  }
}

export default DialogueEngine;
