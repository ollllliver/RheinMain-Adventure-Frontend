import { Audio } from 'three/src/audio/Audio'
import { AudioLoader } from 'three/src/loaders/AudioLoader'
import { AudioListner } from 'three/src/audio/AudioListener'

/**
 * Loader Klasse zum Laden der Audio Files
 */

export class SoundLoader {
    private listener: typeof AudioListener;
    private loader: typeof AudioLoader;
    public audio: typeof Audio;
    constructor() {
        this.listener = new AudioListner();
        this.loader = new AudioLoader();
        this.audio = new Audio(this.listener);
    }

    /**
     * Methode zum laden der Audio Datei
     * @param datei Pfad zur Audio Datei die geladen werden soll
     * @returns geladenes Audio File
     */
    public ladeDatei = (stream : string) => {
        this.loader.load(stream, function(buffer:AudioBuffer) {})
    }

    public abspielen = () => {
        this.loader.play()
    }
}
