export abstract class BaseEvent{
    readonly timestamp : Date;
    constructor(){
        this.timestamp= new Date()
    }
}