import {ASTVisitor} from './ASTNode';
import LiteralExpr from './LiteralExpr'

/**
 * ASTNode representing a numeric literal 
 */
class NumericLiteral extends LiteralExpr {
  constructor(private value: number){
    super()
  }
  
  accept(visitor: ASTVisitor): void {
    visitor.visit(this)
    //throw new Error('Method not implemented.');
  }
  
  text() : string {
    return this.value.toString();
  }
}

export default NumericLiteral