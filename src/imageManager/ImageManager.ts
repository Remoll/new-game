import { ImageKey, ImageMap } from "./types";

import playerImage from "@/imageManager/images/playerImage.png";
import playerDeadImage from "@/imageManager/images/playerDeadImage.png";
import enemyImage from "@/imageManager/images/enemyImage.png";
import enemyDeadImage from "@/imageManager/images/enemyDeadImage.png";
import potionImage from "@/imageManager/images/potionImage.png";
import floorImage from "@/imageManager/images/floorImage.png";
import blockImage from "@/imageManager/images/blockImage.png";
import doorClosedImage from "@/imageManager/images/doorClosedImage.png";
import doorOpenImage from "@/imageManager/images/doorOpenImage.png";
import scrollImage from "@/imageManager/images/scrollImage.png";
import fireOrbImage from "@/imageManager/images/fireOrbImage.png";
import gatewayImage from "@/imageManager/images/gatewayImage.png";
import dogImage from "@/imageManager/images/dogImage.png";
import dogDeadImage from "@/imageManager/images/dogDeadImage.png";

class ImageManager {
    private static _instance: ImageManager;
    private images: ImageMap = {
        [ImageKey.PLAYER]: undefined,
        [ImageKey.PLAYER_DEAD]: undefined,
        [ImageKey.ENEMY]: undefined,
        [ImageKey.POTION]: undefined,
        [ImageKey.ENEMY_DEAD]: undefined,
        [ImageKey.FLOOR]: undefined,
        [ImageKey.BLOCK]: undefined,
        [ImageKey.DOOR_CLOSED]: undefined,
        [ImageKey.DOOR_OPEN]: undefined,
        [ImageKey.SCROLL]: undefined,
        [ImageKey.FIRE_ORB]: undefined,
        [ImageKey.GATEWAY]: undefined,
        [ImageKey.DOG]: undefined,
        [ImageKey.DOG_DEAD]: undefined,
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
        const [player, playerDead, enemy, enemyDead, potion, floor, block, doorClosed, doorOpen, scroll, fireOrb, gateway, dog, dogDead] = await Promise.all([
            this.imageLoader(playerImage),
            this.imageLoader(playerDeadImage),
            this.imageLoader(enemyImage),
            this.imageLoader(enemyDeadImage),
            this.imageLoader(potionImage),
            this.imageLoader(floorImage),
            this.imageLoader(blockImage),
            this.imageLoader(doorClosedImage),
            this.imageLoader(doorOpenImage),
            this.imageLoader(scrollImage),
            this.imageLoader(fireOrbImage),
            this.imageLoader(gatewayImage),
            this.imageLoader(dogImage),
            this.imageLoader(dogDeadImage),
        ])
        this.setImages({ player, playerDead, enemy, enemyDead, potion, floor, block, doorClosed, doorOpen, scroll, fireOrb, gateway, dog, dogDead });
    }

    getImage(key: string): HTMLImageElement | undefined {
        return this.images[key];
    }
}

export default ImageManager;
