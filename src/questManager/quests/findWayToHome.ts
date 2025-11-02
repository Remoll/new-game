import { QuestData, QuestKey, QuestType } from '../types.ts';

const findWayToHome: QuestData = {
  id: QuestKey.FIND_WAY_TO_HOME,
  name: 'Find way to home',
  type: QuestType.MAIN,
  currentStage: 0,
  isCompleted: false,
  stages: [
    {
      id: 0,
      description: 'Ask innkeeper for direction.',
      objective: 'Speak with innkeeper.',
    },
    {
      id: 1,
      description:
        'Leave the inn and follow the road to the forest to the east.',
      objective: 'Leave the inn and follow the road to the forest to the east',
    },
    {
      id: 2,
      description: '',
      objective: '',
    },
  ],
};

export default findWayToHome;
