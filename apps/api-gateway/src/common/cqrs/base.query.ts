export abstract class BaseQuery{
    readonly timestamp : Date;
    constructor(){
        this.timestamp= new Date()
    }
}