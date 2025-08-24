import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

class modelLoader {
    constructor() {
        this.loader = new GLTFLoader()
        const draco = new DRACOLoader()
        draco.setDecoderConfig({ type: "js" })
        draco.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/")
        this.loader.setDRACOLoader(draco)
    }

    async load(fileUrl) {
        const gltf = await this.loader.loadAsync(fileUrl);
        return gltf;
    }
}

export default modelLoader;