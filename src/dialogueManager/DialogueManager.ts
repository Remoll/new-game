import DialogueParser from './DialogueParser.ts';
import { DialogueGraph, DialogueKey } from './types.ts';

class DialogueManager {
  private static singleton: DialogueManager;
  private dialogues: Record<DialogueKey, DialogueGraph> = {
    [DialogueKey.INNKEEPER]: null,
  };

  private constructor() {}

  public static getSingleton(): DialogueManager {
    if (!DialogueManager.singleton) {
      DialogueManager.singleton = new DialogueManager();
    }
    return DialogueManager.singleton;
  }

  async preloadDialogues(): Promise<void> {
    const [innkeeper] = await Promise.all([
      import('./dialogues/innkeeper.dlg?raw'),
    ]);

    this.dialogues = {
      innkeeper: DialogueParser.parse(
        (innkeeper.default ?? innkeeper) as unknown as string
      ),
    };
  }

  getDialogue(dialogueKey: DialogueKey): DialogueGraph | undefined {
    return this.dialogues[dialogueKey];
  }
}

export default DialogueManager;
