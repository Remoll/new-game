import { QuestData, QuestKey, QuestType } from '../types.ts';

const findLostBarrel: QuestData = {
  id: QuestKey.FIND_LOST_BARREL,
  name: 'Find lost barrel',
  type: QuestType.SIDE,
  currentStage: 0,
  isCompleted: false,
  stages: [
    {
      id: 0,
      description: 'Find lost barrel.',
      objective: 'Find lost barrel in forrest.',
    },
    {
      id: 1,
      description: 'Give back the lost barrel to innkeeper.',
      objective: 'Give back the lost barrel to innkeeper.',
    },
  ],
};

export default findLostBarrel;
