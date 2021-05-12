import {ASTVisitor} from './ASTNode';
import LiteralExpr from './LiteralExpr'

/**
 * ASTNode representing a string literal 
 */
class StringLiteral extends LiteralExpr {
  constructor(private literal : string){
    super()
   }

  accept(visitor: ASTVisitor): void {
    visitor.visit(this)
    //throw new Error('Method not implemented.');
  }
  
  public text() : string {
    return "\"" + this.literal + "\"";
  }  
}

export default StringLiteral