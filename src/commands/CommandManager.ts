/**
 * Das Command interface deklariert eine Methode für das Ausführen eines Befehls (Command)
 */
 interface ICommand {
    execute(): any; //Befehl ausführen
    undo(): any; //Befehl rückgängig machen
    describe(): string;
}

/**
 * Die Command-Historie als Stack.
 * Invoker
 */
class CommandStack{
    private stack: ICommand[] = [];
    private static commandstack: CommandStack;
    private index = 0;

   //constructor(){}



    public static getInstance() {
        if(!this.commandstack){
            this.commandstack = new CommandStack();
        }
        return this.commandstack;
    }


    /**
     * Befehl auf den Stack legen
     */
    push = (cmd: ICommand) => {
        if( this.index<this.stack.length ){
            /*
             * Wenn neuer Befehl hinzugefügt wird und man sich nicht am Ende der Liste befindet,
             * werden die restlichen Befehle in der Liste gelöscht.
             * Die Historie geht ab diesem Punkt, also wieder neu weiter.
             * Kann man vielleicht auch eleganter lösen, idk
             */
            do { this.stack.pop() } while (this.index<this.stack.length);
        }
        this.stack.push(cmd)
        this.index++;
        console.log(cmd.describe() + " auf Stack gelegt.");
    }

    /**
     * Rückgängig machen des zuletzt hinzugefügten Befehls
     */
    undo = () => {
        if ( this.index > 0 ){
            this.index--;
            const cmd: ICommand = this.stack[this.index];
            cmd.undo();
            // this.stack.pop()
            console.log(cmd.describe() + " rückgängig gemacht.");
        } else {
            //vielleicht Exception werfen
            console.log("Hier gibts nichts rückgängig zu machen  ¯\\_(ツ)_/¯");
        }
    }

    /**
     * Wiederholen des zuletzt rückgängig gemachten Befehls
     */
    redo = () => {
        if (this.index < this.stack.length) {
            const cmd: ICommand = this.stack[this.index];
            cmd.execute();
            this.index++;
        } else {
            console.log("Nichts zu wiederholen  ¯\\_(ツ)_/¯");
        }
    }


    /**
     * Führt mitgegebenen Befehl aus und legt ihn auf den Stack
     * @param command auszuführender Befehl
     */
    execAndPush = (cmd: ICommand) => {
        cmd.execute();
        this.push(cmd);
    }

    /**
     * @returns Liste der Befehle im Stack liegen
     */
     toString = () => {
        let res = "Command Stack:\n"
        this.stack.forEach(cmd => {
            res += "\t" + cmd.describe() + "\n";
        });
        return res;
    }
      
}

export {ICommand, CommandStack}