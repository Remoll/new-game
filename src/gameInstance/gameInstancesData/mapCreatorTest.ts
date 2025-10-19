import { GameInstanceData } from '../types.ts';
import gameInstance from './gameInstance.json';

const mapCreatorTest: GameInstanceData = { ...gameInstance, gateways: [] };

export default mapCreatorTest;
