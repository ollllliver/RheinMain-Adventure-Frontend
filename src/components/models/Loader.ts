import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class Loader {
    private loader: any;
    public _obj: any;
    constructor(datei: string) {
        this.loader = new GLTFLoader();
        this.loader.load(datei, (gltf:any) => {
            this._obj = gltf;
        })
    }
    
     
    public get obj() : any {
        return this._obj
    }
    
    
    
}
