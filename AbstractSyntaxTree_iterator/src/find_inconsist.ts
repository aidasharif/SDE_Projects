import ITypeCheckError from "./ITypeCheckError"
import StringLiteral from '../src/StringLiteral'
import NumericLiteral from '../src/NumericLiteral'
import PlusExpr from '../src/PlusExpr'
import InconsistentTypesInPlusError from "./InconsistentTypesInPlusError";

class find_inconsist{

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

export default find_inconsist