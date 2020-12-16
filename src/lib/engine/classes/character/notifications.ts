export class Notification {
    private id:number;
    private skillName: string; 
    private msg:string;    
    private skillpic:string;

    constructor(data:any){
        this.id = data.id
        this.msg = data.msg
        this.skillpic = data.skillpic
        this.skillName = data.skillName
    }
}