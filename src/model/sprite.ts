export class Sprite {
    constructor(
        protected texture: HTMLImageElement,
        protected rect?: [number, number, number, number]
    ) {
        if (!rect) {
            if (texture.complete && texture.naturalHeight) {
                this.rect = [0, 0, texture.naturalWidth, texture.naturalHeight];
            } else {
                var self = this;
                var textureOnLoad = function() {
                    self.rect = [0, 0, texture.naturalWidth, texture.naturalHeight];
                    self.texture.removeEventListener('load', textureOnLoad);
                    self.texture.removeEventListener('error', textureOnLoad);
                };
                texture.addEventListener('load', textureOnLoad, false);
                texture.addEventListener('error', textureOnLoad, false);
            }
        } else {
            this.rect = rect;
        }
    }

    isLoaded(): boolean {
        return this.texture.complete && !!this.texture.naturalHeight;
    }

    destroy() {
        // TODO
        // this.texture.src = '1x1.png';
        // this.texture = null;
    }

    static fromSRC(src: string, rect?: [number, number, number, number]): Sprite {
        var texture = new Image();
        texture.src = src;
        return new Sprite(texture, rect);
    }

    static placeholder(rect: [number, number, number, number]): Sprite {
        throw new Error('Not implemented');
    }

    static empty(): Sprite {
        // TODO
        return Sprite.fromSRC('');
    }
}