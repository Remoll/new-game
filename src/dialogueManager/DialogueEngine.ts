import DialogueManager from '@/dialogueManager/DialogueManager.ts';
import {
  DialogueActionType,
  DialogueConditionType,
  DialogueGraph,
  DialogueKey,
  DialogueNode,
  DialogueOption,
} from '@/dialogueManager/types.ts';
import GameState from '@/gameState/GameState.ts';
import { QuestManager } from '@/questManager/QuestManager.ts';
import { QuestKey } from '@/questManager/types.ts';
import DialogueUI from '@/ui/dialogueHandler/DialogueUI.ts';

class DialogueEngine {
  private static singleton: DialogueEngine | null = null;
  private currentDialogueGraph: DialogueGraph;
  private currentDialogueNode: DialogueNode;
  private activeOptions: DialogueOption[];
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
    const actionName = actionParts[0] as DialogueActionType;
    const actionAttributes = actionParts.slice(1, actionParts.length);

    switch (actionName) {
      case DialogueActionType.TRADE:
        console.log('hande trade');
        break;

      case DialogueActionType.END:
        this.endDialogue();
        break;

      case DialogueActionType.START_QUEST:
        QuestManager.getSingleton().startQuest(actionAttributes[0] as QuestKey);
        break;

      case DialogueActionType.UPDATE_QUEST:
        QuestManager.getSingleton().updateQuestStage(
          actionAttributes[0] as QuestKey,
          parseInt(actionAttributes[1])
        );
        break;

      case DialogueActionType.COMPLETE_QUEST:
        QuestManager.getSingleton().completeQuest(
          actionAttributes[0] as QuestKey
        );
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

  private checkCondition(conditionPart: string) {
    let workingConditionPart = conditionPart;

    const isNegation = workingConditionPart.startsWith('!');
    if (isNegation) {
      workingConditionPart = workingConditionPart.slice(1);
    }

    const conditionPartParts = workingConditionPart.split(' ');
    const conditionPartName = conditionPartParts[0] as DialogueConditionType;
    const conditionPartAttributes = conditionPartParts.slice(
      1,
      conditionPartParts.length
    );

    let checkedCondition: boolean;

    switch (conditionPartName) {
      case DialogueConditionType.QUEST_ACTIVE: {
        const questSingleton = QuestManager.getSingleton();
        const questKey = conditionPartAttributes[0] as QuestKey;
        const questStage = parseInt(conditionPartAttributes[1]);

        const isQuestActive = questSingleton.isQuestActive(questKey);

        if (!questStage && questStage !== 0) {
          checkedCondition = isQuestActive;
          break;
        }

        checkedCondition =
          isQuestActive &&
          questSingleton.getQuestCurrentStage(questKey) === questStage;

        break;
      }

      case DialogueConditionType.QUEST_COMPLETED: {
        const questKey = conditionPartAttributes[0] as QuestKey;

        checkedCondition =
          QuestManager.getSingleton().isQuestCompleted(questKey);

        break;
      }

      case DialogueConditionType.HAVE_ITEM: {
        const itemType = conditionPartAttributes[0];
        const itemQuantity = parseInt(conditionPartAttributes[1]);

        const player = GameState.getPlayer();

        const itemsOfType = player
          .getItems()
          .filter((item) => item.getType() === itemType);

        // TODO: handle < and > for items check
        checkedCondition = itemsOfType.length === itemQuantity;

        break;
      }

      default:
        checkedCondition = true;
        break;
    }

    return isNegation ? !checkedCondition : checkedCondition;
  }

  private filterActiveOptions() {
    this.activeOptions = this.currentDialogueNode.options.filter((node) => {
      if (!node.conditions) {
        return true;
      }

      const conditionParts = node.conditions.condition.split(' && ');

      const resolvedConditions = conditionParts.map(this.checkCondition);

      return resolvedConditions.every((condition) => condition);
    });
  }

  goToDialogueNode(selectedKey: number) {
    const optionIndex = selectedKey - 1;
    const selectedOption = this.activeOptions[optionIndex];
    const action = selectedOption.action;

    if (action) {
      this.executeActionFromDialogue(action);
    }

    const nextNode = this.currentDialogueGraph[selectedOption.target];
    if (!nextNode) {
      return;
    }
    this.currentDialogueNode = nextNode;
    this.filterActiveOptions();
    this.dialogueUi.fillDialogueUi({
      ...this.currentDialogueNode,
      options: this.activeOptions,
    });
  }

  initDialogue(dialogueKey: DialogueKey) {
    this.currentDialogueGraph =
      DialogueManager.getSingleton().getDialogue(dialogueKey);

    this.currentDialogueNode = this.currentDialogueGraph.start;

    this.filterActiveOptions();

    this.dialogueUi.fillDialogueUi({
      ...this.currentDialogueNode,
      options: this.activeOptions,
    });

    this.dialogueUi.openDialogueContainer();
    GameState.setIsDialogueOpen(true);
  }
}

export default DialogueEngine;
