import {ASTVisitor} from './ASTNode';
import Expr from './Expr'

/**
 * ASTNode representing a binary "+" expression 
 */
class PlusExpr extends Expr {
  constructor(public left: Expr, public right: Expr){
    super()
   }

  accept(visitor: ASTVisitor): void {
    visitor.visit(this)
    this.left.accept(visitor)
    this.right.accept(visitor)
    //throw new Error('Method not implemented.');
  }

  public text() : string {
       return this.left.text() + " + " + this.right.text(); 
  }
}

export default PlusExpr