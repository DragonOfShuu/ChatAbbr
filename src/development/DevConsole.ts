import inDevMode from "./InDevMode";

class DevConsole {
    static log(...objects: any[]) {
        if (!inDevMode()) return;
        console.log(...objects);
    }

    static error(...objects: any[]) {
        if (!inDevMode())
            console.log("Error in production--")
        console.log(...objects)
    }
}

export default DevConsole;
