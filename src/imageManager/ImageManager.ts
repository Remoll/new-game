import { ImageKey, ImageMap } from "./types";

import playerImage from "@/imageManager/images/playerImage.png";
import playerDeadImage from "@/imageManager/images/playerDeadImage.png";
import enemyImage from "@/imageManager/images/enemyImage.png";
import enemyDeadImage from "@/imageManager/images/enemyDeadImage.png";
import potionImage from "@/imageManager/images/potionImage.png";
import stoneBlockLightImage from "@/imageManager/images/stoneBlockLightImage.png";
import stoneBlockDarkImage from "@/imageManager/images/stoneBlockDarkImage.png";
import doorClosedImage from "@/imageManager/images/doorClosedImage.png";
import doorOpenImage from "@/imageManager/images/doorOpenImage.png";
import scrollImage from "@/imageManager/images/scrollImage.png";
import fireOrbImage from "@/imageManager/images/fireOrbImage.png";
import gatewayImage from "@/imageManager/images/gatewayImage.png";
import dogImage from "@/imageManager/images/dogImage.png";
import dogDeadImage from "@/imageManager/images/dogDeadImage.png";
import grassBlockImage from "@/imageManager/images/grassBlockImage.png";
import fireElementalImage from "@/imageManager/images/fireElementalImage.png";
import laboratoryImage from "@/imageManager/images/laboratoryImage.png";
import fireWandImage from "@/imageManager/images/fireWandImage.png";
import pileOfDustImage from "@/imageManager/images/pileOfDustImage.png";
import wandImage from "@/imageManager/images/wandImage.png";
import wizardImage from "@/imageManager/images/wizardImage.png";
import wizardDeadImage from "@/imageManager/images/wizardDeadImage.png";
import iceOrbImage from "@/imageManager/images/iceOrbImage.png";
import chestImage from "@/imageManager/images/chestImage.png";

class ImageManager {
    private static _instance: ImageManager;
    private images: ImageMap = {
        [ImageKey.PLAYER]: undefined,
        [ImageKey.PLAYER_DEAD]: undefined,
        [ImageKey.ENEMY]: undefined,
        [ImageKey.POTION]: undefined,
        [ImageKey.ENEMY_DEAD]: undefined,
        [ImageKey.STONE_BLOCK_LIGHT]: undefined,
        [ImageKey.DOOR_CLOSED]: undefined,
        [ImageKey.DOOR_OPEN]: undefined,
        [ImageKey.SCROLL]: undefined,
        [ImageKey.FIRE_ORB]: undefined,
        [ImageKey.GATEWAY]: undefined,
        [ImageKey.DOG]: undefined,
        [ImageKey.DOG_DEAD]: undefined,
        [ImageKey.STONE_BLICK_DARK]: undefined,
        [ImageKey.GRASS_BLOCK]: undefined,
        [ImageKey.FIRE_ELEMENTAL]: undefined,
        [ImageKey.LABORATORY]: undefined,
        [ImageKey.FIRE_WAND]: undefined,
        [ImageKey.PILE_OF_DUST]: undefined,
        [ImageKey.WAND]: undefined,
        [ImageKey.WIZARD]: undefined,
        [ImageKey.WIZARD_DEAD]: undefined,
        [ImageKey.ICE_ORB]: undefined,
        [ImageKey.CHEST]: undefined,
    };

    private constructor() { }

    public static get instance(): ImageManager {
        if (!ImageManager._instance) {
            ImageManager._instance = new ImageManager();
        }
        return ImageManager._instance;
    }

    private setImages(images: ImageMap) {
        this.images = images;
    }

    private imageLoader = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.src = src
            img.onload = () => resolve(img)
            img.onerror = (err) => reject(err)
        })
    }

    preloadImages = async (): Promise<void> => {
        const [player, playerDead, enemy, enemyDead, potion, stoneBlockLight, doorClosed, doorOpen, scroll, fireOrb, gateway, dog, dogDead, stoneBlockDark, grassBlock, fireElemental, laboratory, fireWand, pileOfDust, wand, wizard, wizardDead, iceOrb, chest] = await Promise.all([
            this.imageLoader(playerImage),
            this.imageLoader(playerDeadImage),
            this.imageLoader(enemyImage),
            this.imageLoader(enemyDeadImage),
            this.imageLoader(potionImage),
            this.imageLoader(stoneBlockLightImage),
            this.imageLoader(doorClosedImage),
            this.imageLoader(doorOpenImage),
            this.imageLoader(scrollImage),
            this.imageLoader(fireOrbImage),
            this.imageLoader(gatewayImage),
            this.imageLoader(dogImage),
            this.imageLoader(dogDeadImage),
            this.imageLoader(stoneBlockDarkImage),
            this.imageLoader(grassBlockImage),
            this.imageLoader(fireElementalImage),
            this.imageLoader(laboratoryImage),
            this.imageLoader(fireWandImage),
            this.imageLoader(pileOfDustImage),
            this.imageLoader(wandImage),
            this.imageLoader(wizardImage),
            this.imageLoader(wizardDeadImage),
            this.imageLoader(iceOrbImage),
            this.imageLoader(chestImage),
        ])
        this.setImages({ player, playerDead, enemy, enemyDead, potion, stoneBlockLight, doorClosed, doorOpen, scroll, fireOrb, gateway, dog, dogDead, stoneBlockDark, grassBlock, fireElemental, laboratory, fireWand, pileOfDust, wand, wizard, wizardDead, iceOrb, chest });
    }

    getImage(key: string): HTMLImageElement | undefined {
        return this.images[key];
    }
}

export default ImageManager;
