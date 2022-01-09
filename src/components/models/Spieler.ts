export class Spieler {

    name: string;
    height: number;
    turnSpeed: number;
    speed: number;
    jumpHeight: number;
    velocity: number;
    position: Position;
    jumps: boolean;
    ducks: boolean;
    eigenschaften: {position: Position};
    constructor(){ 
        this.name = "default"; //TODO
        this.height = .5;
        this.turnSpeed = .1;
        this.speed = .1;
        this.jumpHeight = .2;
        this.velocity = 0;
        this.position = { x:0, y:0, z:0 };
        this.jumps = false;
        this.ducks = false;
        this.eigenschaften = {position: this.position};
    }
}

export class Position {
    x:number;
    y:number;
    z:number;
    constructor(x:number,y:number,z:number){
        this.x = x;
        this.y = x;
        this.z = z;
    }
}

export interface SpielerInterface{
    name: string;
    eigenschaften: SpielerEigenschaften;
    host: boolean;
}

interface SpielerEigenschaften{
    position: Position;
    statusListe: any;
}

