import Effect from "@/effect/Effect";
import Entity from "@/gameObject/entity/Entity";

class Reanimate extends Effect {
    static execute(userEntity: Entity, targetEntity: Entity): void {
        const userFaction = userEntity.getFaction();
        const userFactionDisposition = userEntity.getDispositionToFactions();

        targetEntity.setFaction(userFaction);
        targetEntity.setDispositionToFactions(userFactionDisposition);
        targetEntity.setCanOccupiedFields(true);
        targetEntity.setHp(targetEntity.getInitialHp());
        targetEntity.setIsReanimate(true);
    }
}

export default Reanimate;