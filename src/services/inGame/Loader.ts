import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

/**
 * Loader Klasse zum Laden der GLTF Objekte
 */

export class Loader {
    private loader: typeof GLTFLoader;
    constructor() {
        this.loader = new GLTFLoader();
    }

    /**
     * Methode zum laden der GLTF Datei
     * @param datei Pfad zur GLTF Datei die geladen werden soll
     * @returns geladenes GLTF Objekt
     */
    public ladeDatei = (datei : string) => {
        const result = new Promise<JSON>((resolve) => {
            this.loader.load(datei, (gltf:Promise<JSON>) => {
                resolve(gltf)
            })
        })
        return result
    }
}
