import Stmt from './Stmt'
import Expr from './Expr'
import {ASTVisitor} from './ASTNode';

/**
 * ASTNode representing an assignment statement  
 */
class Assignment extends Stmt {
  constructor(private varName: string, private exp: Expr){
    super()
   }
 
  accept(visitor: ASTVisitor): void {
    visitor.visit(this)
    this.exp.accept(visitor)
    //throw new Error('Method not implemented.');
  }
  
  public text() : string {
    return this.varName + " = " + this.exp.text();
  } 
}

export default Assignment