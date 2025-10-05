import { Quest } from '../types.ts';

const findWayToHome: Quest = {
  id: 'findWayToHome',
  name: 'Find way to home',
  type: 'main',
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
  ],
};

export default findWayToHome;
