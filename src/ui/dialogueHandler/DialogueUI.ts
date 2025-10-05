import { DialogueNode } from '@/dialogueManager/types.ts';

class DialogueUI {
  private static singleton: DialogueUI | null = null;

  private dialogueContainer: HTMLElement;
  private npcText: HTMLElement;
  private playerResponsesList: HTMLElement;

  private constructor() {
    this.dialogueContainer = document.getElementById('dialogue');
    this.npcText = document.getElementById('npc-text');
    this.playerResponsesList = document.getElementById('player-responses');

    if (!this.dialogueContainer || !this.npcText || !this.playerResponsesList) {
      console.error('some dialogue elements not found');
    }
  }

  static getSingleton(): DialogueUI {
    if (!DialogueUI.singleton) {
      DialogueUI.singleton = new DialogueUI();
    }
    return DialogueUI.singleton;
  }

  openDialogueContainer() {
    this.dialogueContainer.style.display = 'block';
  }

  closeDialogueContainer() {
    this.dialogueContainer.style.display = 'none';
  }

  clearDialogueUi(): void {
    this.npcText.textContent = '';
    while (this.playerResponsesList.firstChild) {
      this.playerResponsesList.removeChild(this.playerResponsesList.firstChild);
    }
  }

  fillDialogueUi(dialogueNode: DialogueNode) {
    this.clearDialogueUi();

    this.npcText.textContent = dialogueNode.text[0];

    dialogueNode.options.forEach((option, index) => {
      const listElement = document.createElement('li');
      listElement.id = `dialogue-option-${index}`;
      listElement.textContent = `${index + 1}. ${option.text}`;

      this.playerResponsesList.appendChild(listElement);
    });
  }
}

export default DialogueUI;
