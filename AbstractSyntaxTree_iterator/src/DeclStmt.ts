import {ASTVisitor} from './ASTNode';
import Stmt from './Stmt'

/**
 * ASTNode representing a variable declaration  
 */
class DeclStmt extends Stmt {
  constructor(private varName : string){ 
    super()
  }
  accept(visitor: ASTVisitor): void {
    visitor.visit(this)
    //throw new Error('Method not implemented.');
  }
  
  public text() : string {
    return "declare " + this.varName;
  }

  public getVarname(){
    //console.log("var name is"+this.varName)
    return this.varName
  }
}

export default DeclStmt