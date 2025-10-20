import { GameInstanceData } from '../types.ts';
import gameInstance from './gameInstance.json';

const mapCreatorTest: GameInstanceData = {
  ...(gameInstance as GameInstanceData),
  gateways: [],
};

export default mapCreatorTest;
