import editorStore from '@/stores/editor'

/**
 * Das Command interface deklariert eine Methode für das Ausführen eines Befehls (Command)
 */
interface ICommand {
    execute(): any; //Befehl ausführen
    undo(): any; //Befehl rückgängig machen
    //redo(): any; //Befehl wiederholen
    describe(): string;
    getStack(): ICommand[];
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
        if (!this.commandstack) {
            this.commandstack = new CommandStack();
        }
        return this.commandstack;
    }

    /**
     * Befehl auf den Stack legen
     */
    push = (cmd: ICommand) => {
        if (this.index < this.stack.length) {
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
    }
    
    reset = () => {
        this.stack = []
        this.index = 0
    }

    /**
     * Rückgängig machen des zuletzt hinzugefügten Befehls
     */
    undo = () => {
        if (this.index > 0) {
            this.index--;
            const cmd: ICommand = this.stack[this.index];
            cmd.undo();
            editorStore.info(cmd.describe() + " rückgängig gemacht.")
        } else {
            editorStore.info("Hier gibts nichts rückgängig zu machen  ¯\\_(ツ)_/¯")
        }
    }

    /**
     * Wiederholen des zuletzt rückgängig gemachten Befehls
     */
    redo = () => {
        if (this.index < this.stack.length) {
            const cmd: ICommand = this.stack[this.index];
            cmd.describe();
            cmd.execute();
            editorStore.info(cmd.describe() + " wiederhergestellt.")
            this.index++;
        } else {
            editorStore.info("Hier gibts nichts zu wiederholen  ¯\\_(ツ)_/¯")
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

    getStack = () => {
        return this.stack
    }

}

export { ICommand, CommandStack }
