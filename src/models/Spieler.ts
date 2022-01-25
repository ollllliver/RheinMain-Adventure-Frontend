export class Spieler {

    name: string;
    height: number;
    turnSpeed: number;
    speed: number;
    jumpHeight: number;
    velocity: number;
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
        this.jumps = false;
        this.ducks = false;
        this.eigenschaften = new SpielerEigenschaften;
    }

    setPosition(pos: Position): void{
        this.eigenschaften.position = pos;
    }
}

class SpielerEigenschaften{
    position = new Position(0,0,0);
    statusListe: any;
}

export class Position {
    x:number;
    y:number;
    z:number;
    constructor(x:number,y:number,z:number){
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
