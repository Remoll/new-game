import { IEntity } from "../../entity/types";

interface IField {
  x: Number;
  y: Number;
  occupied: boolean;
  occupiedBy: IEntity | null;
}

export { IField };
