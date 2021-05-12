import ITypeCheckError from "./ITypeCheckError";
import NumericLiteral from "./NumericLiteral";
import PlusExpr from "./PlusExpr";
import StringLiteral from "./StringLiteral";

class InconsistentTypesInPlusError implements ITypeCheckError{

    private error: PlusExpr

    public constructor(error: PlusExpr){
        this.error=error
    }

    public toString():string{
        return "Type error in expression: "+this.error.text()
    }

    find_inconsist(all_plusExpr:Array<PlusExpr>):Array<ITypeCheckError>{
        let array_inconsis=[]
        for (var i = 0; i < all_plusExpr.length; i++){
            if ((all_plusExpr[i].left instanceof NumericLiteral &&  
                all_plusExpr[i].right instanceof StringLiteral ) 
            || (all_plusExpr[i].right instanceof NumericLiteral && 
                 all_plusExpr[i].left instanceof StringLiteral)) {
                    array_inconsis.push(new InconsistentTypesInPlusError(all_plusExpr[i]))
          }
        }
        return array_inconsis
    }
}

export default InconsistentTypesInPlusError