import IIterator from "./IIterator";

class Iterator1<T> implements IIterator<T>{
    
    private length: number
    private nextIndex=0
    private statement:Array<T>
    public constructor(private stm:Array<T>){
        this.statement=stm
        this.length=this.statement.length
        //console.log("at iterator list is " +this.statement)
    }

    public hasNext(): boolean {
        return this.nextIndex < this.length;
    } 

    public next(): T{
        if (this.length==0 || this.statement==null || this==undefined){
            return
        }

        if (this.hasNext ()){
            let nextEntry = this.statement [this.nextIndex];
            this.nextIndex++; // advance iterator
            //console.log("in iterator   ",nextEntry.text())
            return nextEntry;
        }
        else{
            return
        }    
    }
}

export default Iterator1