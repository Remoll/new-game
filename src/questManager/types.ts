enum QuestType {
  MAIN = 'main',
  SIDE = 'side',
}

enum QuestKey {
  FIND_LOST_BARREL = 'findLostBarrel',
  FIND_WAY_TO_HOME = 'findWayToHome',
}

interface QuestStage {
  id: number;
  description: string;
  objective: string;
  completed?: boolean;
}

interface QuestData {
  id: QuestKey;
  name: string;
  type: QuestType;
  stages: QuestStage[];
  currentStage: number;
  isCompleted: boolean;
  // opcjonalne warunki rozpoczęcia
  requirements?: string[]; // np. ["mainQuest >= 2"]
}

export { QuestType, QuestStage, QuestData, QuestKey };
