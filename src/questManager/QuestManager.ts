import { Quest } from './types.ts';

export class QuestManager {
  private static singleton: QuestManager | null = null;
  private quests: Map<string, Quest> = new Map();

  private constructor() {}

  /** Singleton */
  static getSingleton(): QuestManager {
    if (!QuestManager.singleton) {
      QuestManager.singleton = new QuestManager();
    }
    return QuestManager.singleton;
  }

  // =======================
  //   ZARZĄDZANIE QUESTAMI
  // =======================

  /** Dodaje nowy quest */
  addQuest(quest: Quest): void {
    if (this.quests.has(quest.id)) {
      console.warn(`Quest '${quest.id}' już istnieje — pomijam.`);
      return;
    }
    this.quests.set(quest.id, quest);
  }

  /** Pobiera quest po ID */
  getQuest(id: string): Quest | undefined {
    return this.quests.get(id);
  }

  /** Zwraca wszystkie questy */
  getAllQuests(): Quest[] {
    return Array.from(this.quests.values());
  }

  /** Zwraca tylko aktywne questy */
  getActiveQuests(): Quest[] {
    return Array.from(this.quests.values()).filter((q) => !q.isCompleted);
  }

  /** Zwraca questy ukończone */
  getCompletedQuests(): Quest[] {
    return Array.from(this.quests.values()).filter((q) => q.isCompleted);
  }

  // =======================
  //   ZMIANA STANU QUESTÓW
  // =======================

  /** Aktualizuje etap questa (np. z DSL: { action: questUpdate mainQuest 1 }) */
  updateQuestStage(questId: string, newStageIndex: number): void {
    const quest = this.quests.get(questId);
    if (!quest) {
      console.warn(`Quest '${questId}' nie istnieje.`);
      return;
    }

    if (newStageIndex < 0 || newStageIndex >= quest.stages.length) {
      console.warn(`Nieprawidłowy indeks etapu dla questa '${questId}'.`);
      return;
    }

    quest.currentStage = newStageIndex;

    // Oznacz poprzednie etapy jako ukończone
    quest.stages.forEach((s) => {
      s.completed = s.id <= newStageIndex;
    });

    // Jeśli osiągnęliśmy ostatni etap
    if (newStageIndex === quest.stages.length - 1) {
      quest.isCompleted = true;
      console.log(`✅ Quest ukończony: ${quest.name}`);
    } else {
      console.log(
        `📜 Quest '${quest.name}' zaktualizowany do etapu ${newStageIndex + 1}`
      );
    }
  }

  /** Oznacza questa jako ukończonego */
  completeQuest(questId: string): void {
    const quest = this.quests.get(questId);
    if (!quest) return;
    quest.isCompleted = true;
    quest.currentStage = quest.stages.length - 1;
    quest.stages.forEach((s) => (s.completed = true));
    console.log(`✅ Quest ukończony: ${quest.name}`);
  }

  /** Sprawdza, czy quest jest aktywny */
  isQuestActive(questId: string): boolean {
    const quest = this.quests.get(questId);
    return !!quest && !quest.isCompleted;
  }

  /** Sprawdza, czy quest jest ukończony */
  isQuestCompleted(questId: string): boolean {
    const quest = this.quests.get(questId);
    return !!quest && quest.isCompleted;
  }

  // =======================
  //   ZAPIS / ODCZYT
  // =======================

  /** Eksportuje stan questów (np. do save’a) */
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

  /** Odtwarza stan questów (np. po wczytaniu gry) */
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
