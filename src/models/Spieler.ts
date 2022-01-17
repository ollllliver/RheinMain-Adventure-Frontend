export class Spieler {

    name: string;
    height: number;
    speed: number;
    velocity: number;
    position: Position;
    
    moveForward: boolean;
    moveBackward: boolean;
    moveLeft: boolean;
    moveRight: boolean;
    moveUp: boolean;
    moveDown: boolean;

    eigenschaften: {position: Position};
    constructor(){ 
        this.name = "default";
        this.height = .5;
        this.speed = .1;
        this.velocity = 0;
        this.position = { x:0, y:0, z:0 };

        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;

        this.eigenschaften = new SpielerEigenschaften;
    }

    setMoveBackward(bool: boolean){
        this.moveBackward = bool; 
     }

    getMoveBackward(){
       return this.moveBackward; 
    }

    setMoveForward(bool: boolean){
        this.moveForward = bool; 
     }

    getMoveForward(){
       return this.moveForward; 
    }

    setMoveLeft(bool: boolean){
        this.moveBackward = bool; 
     }

    getMoveLeft(){
        return this.moveBackward; 
     }

    setMoveRight(bool: boolean){
        this.moveBackward = bool; 
     }

    getMoveRight(){
        return this.moveBackward; 
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


export class Velocity {
    x:number;
    y:number;
    z:number;
    constructor(x:number,y:number,z:number){
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
