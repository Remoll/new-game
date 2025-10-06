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
      description: 'Leave inn into road to forest.',
      objective: 'Leave inn.',
    },
    {
      id: 2,
      description: 'Cooo.',
      objective: 'Leave inn.',
    },
  ],
};

export default findWayToHome;
