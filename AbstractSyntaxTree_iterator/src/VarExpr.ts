import {ASTVisitor} from "./ASTNode";
import Expr from './Expr'
import IIterator from './IIterator';
import Stmt from './Stmt';

/**
 * ASTNode representing a variable 
 */
class VarExpr extends Expr {
  constructor(private varName: string){ 
    super()
  }
  public stmtIterator(): IIterator<Stmt> {
    throw new Error('Method not implemented.');
  }
 
  accept(visitor: ASTVisitor): void {
    visitor.visit(this)
    //throw new Error('Method not implemented.');
  }
  
  public text() : string {
       return this.varName; 
  } 
}

export default VarExpr