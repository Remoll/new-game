import { IEntity } from "../../entity/types";

interface IField {
  x: Number;
  y: Number;
  isOccupied: boolean;
  entitiesOnField: IEntity[];
}

export { IField };
