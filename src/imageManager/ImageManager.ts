import playerImage from "@/imageManager/images/playerImage.png";
import enemyImage from "@/imageManager/images/enemyImage.png";
import potionImage from "@/imageManager/images/potionImage.png";
import deadEnemyImage from "@/imageManager/images/deadEnemyImage.png";
import floorImage from "@/imageManager/images/floorImage.png";
import blockImage from "@/imageManager/images/blockImage.png";
import doorClosedImage from "@/imageManager/images/doorClosedImage.png";
import doorOpenImage from "@/imageManager/images/doorOpenImage.png";
import { ImageKey, ImageMap } from "./types";

class ImageManager {
    private static _instance: ImageManager;
    private images: ImageMap = {
        [ImageKey.PLAYER]: undefined,
        [ImageKey.ENEMY]: undefined,
        [ImageKey.POTION]: undefined,
        [ImageKey.DEAD_ENEMY]: undefined,
        [ImageKey.FLOOR]: undefined,
        [ImageKey.BLOCK]: undefined,
        [ImageKey.DOOR_CLOSED]: undefined,
        [ImageKey.DOOR_OPEN]: undefined
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
        const [player, enemy, potion, deadEnemy, floor, block, doorClosed, doorOpen] = await Promise.all([
            this.imageLoader(playerImage),
            this.imageLoader(enemyImage),
            this.imageLoader(potionImage),
            this.imageLoader(deadEnemyImage),
            this.imageLoader(floorImage),
            this.imageLoader(blockImage),
            this.imageLoader(doorClosedImage),
            this.imageLoader(doorOpenImage),
        ])
        this.setImages({ player, enemy, potion, deadEnemy, floor, block, doorClosed, doorOpen });
    }

    getImage(key: string): HTMLImageElement | undefined {
        return this.images[key];
    }
}

export default ImageManager;
