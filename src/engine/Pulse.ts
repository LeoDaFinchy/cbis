class Pulse{
    responders: Set<Function>;
    constructor(){
        this.responders = new Set();
    }
    send(...args: Array<any>) {
        Array.from(this.responders).forEach(fn => fn(...args));
    }
    add(fn:Function) { this.responders.add(fn); }
    remove(fn:Function) {this.responders.delete(fn); }
}

export default Pulse;
