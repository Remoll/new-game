import { InstanceKey } from '@/game/gameInstanceData/types.ts';
import { ImageKey } from '@/imageManager/types.ts';
import { Coordinates } from '@/types.ts';
import Item from './item/Item.ts';

enum Direction {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right',
}

enum Disposition {
  HOSTILE = 'hostile',
  NEUTRAL = 'neutral',
  FRIENDLY = 'friendly',
}

enum Faction {
  PLAYER = 'player_faction',
  ENEMY = 'enemy_faction',
  NEUTRAL = 'neutral_faction',
}

type DispositionToFactions = {
  [key in Disposition]?: Faction[];
};

interface GameObjectImagesKeys {
  default: ImageKey;
  dead: ImageKey;
}

interface GameObjectAttributes {
  type: string;
  x: number;
  y: number;
  imagesKeys: GameObjectImagesKeys;
  canOccupiedFields: boolean;
  isInteractive: boolean;
  itemsAttributes?: GameObjectAttributes[];
}

interface EntityAttributes extends GameObjectAttributes {
  hp: number;
  faction: Faction;
  dispositionToFactions: DispositionToFactions;
  speed: number;
}

interface GatewayAttributes extends GameObjectAttributes {
  targetInstanceKey: InstanceKey;
  targetPlayerCoordinates: Coordinates;
}

type ItemFactory = (itemAttributes: GameObjectAttributes) => Item;

export {
  GameObjectAttributes,
  EntityAttributes,
  GatewayAttributes,
  Direction,
  Disposition,
  Faction,
  DispositionToFactions,
  GameObjectImagesKeys,
  ItemFactory,
};
