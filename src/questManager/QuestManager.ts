import GameNotification from '@/ui/notification/Notification.ts';
import QuestLibrary from './QuestLibrary.ts';
import { QuestData, QuestKey } from './types.ts';

export class QuestManager {
  private static singleton: QuestManager | null = null;
  private quests: Map<string, QuestData> = new Map();
  private gameNotification: GameNotification = GameNotification.getSingleton();

  private constructor() {}

  static getSingleton(): QuestManager {
    if (!QuestManager.singleton) {
      QuestManager.singleton = new QuestManager();
    }
    return QuestManager.singleton;
  }

  private addQuest(questData: QuestData): void {
    if (this.quests.has(questData.id)) {
      console.warn(`Quest '${questData.id}' already exists.`);
      return;
    }
    this.quests.set(questData.id, questData);
    this.gameNotification.displayNewNotification(
      `New Quest Started: ${questData.name}`,
      questData.stages[questData.currentStage].description
    );
  }

  startQuest(questKey: QuestKey) {
    this.addQuest(QuestLibrary.getSingleton().getQuestData(questKey));
  }

  getQuest(id: QuestKey): QuestData | undefined {
    return this.quests.get(id);
  }

  getQuestCurrentStage(id: QuestKey): number {
    return this.quests.get(id).currentStage;
  }

  getAllQuests(): QuestData[] {
    return Array.from(this.quests.values());
  }

  getActiveQuests(): QuestData[] {
    return Array.from(this.quests.values()).filter((q) => !q.isCompleted);
  }

  getCompletedQuests(): QuestData[] {
    return Array.from(this.quests.values()).filter((q) => q.isCompleted);
  }

  updateQuestStage(questId: QuestKey, newStageIndex: number): void {
    const quest = this.quests.get(questId);
    if (!quest) {
      console.warn(`Quest '${questId}' not exists.`);
      return;
    }

    if (newStageIndex < 0 || newStageIndex >= quest.stages.length) {
      console.warn(`Invalid quest stage index:  '${questId}'.`);
      return;
    }

    quest.currentStage = newStageIndex;

    quest.stages.forEach((s) => {
      s.completed = s.id <= newStageIndex;
    });

    if (newStageIndex === quest.stages.length - 1) {
      quest.isCompleted = true;
      this.gameNotification.displayNewNotification(
        `Quest completed: ${quest.name}`,
        ''
      );
    } else {
      this.gameNotification.displayNewNotification(
        `Quest update: ${quest.name}`,
        quest.stages[newStageIndex].description
      );
    }
  }

  completeQuest(questId: QuestKey): void {
    const quest = this.quests.get(questId);
    if (!quest) return;
    quest.isCompleted = true;
    quest.currentStage = quest.stages.length - 1;
    quest.stages.forEach((s) => (s.completed = true));
    this.gameNotification.displayNewNotification(
      `Quest Completed: ${quest.name}`,
      ''
    );
  }

  isQuestActive(questId: QuestKey): boolean {
    const quest = this.quests.get(questId);
    return !!quest && !quest.isCompleted;
  }

  isQuestCompleted(questId: QuestKey): boolean {
    const quest = this.quests.get(questId);
    return !!quest && quest.isCompleted;
  }

  serialize(): Record<string, any> {
    const data: Record<string, any> = {};
    for (const [id, quest] of this.quests) {
      data[id] = {
        currentStage: quest.currentStage,
        isCompleted: quest.isCompleted,
      };
    }
    return data;
  }

  deserialize(savedData: Record<string, any>): void {
    for (const [id, state] of Object.entries(savedData)) {
      const quest = this.quests.get(id);
      if (quest) {
        quest.currentStage = state.currentStage;
        quest.isCompleted = state.isCompleted;
      }
    }
  }
}
