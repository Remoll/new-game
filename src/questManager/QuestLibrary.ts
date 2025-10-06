import { QuestData, QuestKey } from './types.ts';
import findLostBarrel from './quests/findLostBarrel.ts';
import findWayToHome from './quests/findWayToHome.ts';

class QuestLibrary {
  private static singleton: QuestLibrary;
  private quests: Record<QuestKey, QuestData> = {
    [QuestKey.FIND_WAY_TO_HOME]: null,
    [QuestKey.FIND_LOST_BARREL]: null,
  };

  private constructor() {
    this.quests = {
      [QuestKey.FIND_WAY_TO_HOME]: findWayToHome,
      [QuestKey.FIND_LOST_BARREL]: findLostBarrel,
    };
  }

  public static getSingleton(): QuestLibrary {
    if (!QuestLibrary.singleton) {
      QuestLibrary.singleton = new QuestLibrary();
    }
    return QuestLibrary.singleton;
  }

  getQuestData(questKey: QuestKey): QuestData | null {
    return this.quests[questKey];
  }
}

export default QuestLibrary;
