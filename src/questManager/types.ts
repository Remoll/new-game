type QuestType = 'main' | 'side';

interface QuestStage {
  id: number;
  description: string;
  objective?: string;
  completed?: boolean;
}

interface Quest {
  id: string;
  name: string;
  type: QuestType;
  stages: QuestStage[];
  currentStage: number;
  isCompleted: boolean;
  // opcjonalne warunki rozpoczęcia
  requirements?: string[]; // np. ["mainQuest >= 2"]
}

export { QuestType, QuestStage, Quest };
