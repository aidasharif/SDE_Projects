import {ASTVisitor} from './ASTNode';
import Stmt from './Stmt'

/**
 * ASTNode representing a sequence of statements.
 */
class Sequence extends Stmt {
  
  constructor(public stat1: Stmt, public stat2: Stmt){ 
    super()
    if(this.stat1==null || this.stat2==null){
      throw new Error('Sequence is empty');
    }
  }

  accept(visitor: ASTVisitor): void {
    visitor.visit(this)
    this.stat1.accept(visitor)
    this.stat2.accept(visitor)
    //throw new Error('Method not implemented.');
  }
  
  public text() : string {
    return this.stat1.text() + "; " + this.stat2.text();
  }
}

export default Sequence