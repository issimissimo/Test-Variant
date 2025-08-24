import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { AnimationMixer, Clock } from 'three';

class modelLoader {
    constructor() {
        this.loader = new GLTFLoader()
        const draco = new DRACOLoader()
        draco.setDecoderConfig({ type: "js" })
        draco.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/")
        this.loader.setDRACOLoader(draco)
        this.mixer = null;
        this.clock = null;
        this.gltf = null;
        this._loaded = false;
    }

    async load(fileUrl) {
        this.gltf = await this.loader.loadAsync(fileUrl);

        if (this.gltf.animations.length > 0) {
            this.clock = new Clock();
            this.mixer = new AnimationMixer(this.gltf.scene);
            this.gltf.animations.forEach(clip => this.mixer.clipAction(clip).play());
        }

        this._loaded = true;
        return this.gltf;
    }

    animate() {
        if (this.mixer) {
            const dt = this.clock.getDelta();
            this.mixer.update(dt);
        }
        else {
            console.warn("You want to animate an object with NO animations!")
        }
    }

    loaded() {
        return this._loaded;
    }
}

export default modelLoader;