//import ASTVisitor from "./ASTVisitor";

/**
 * Root of the AST Node hierarchy.  
 */
abstract class ASTNode {
  /**
   * create textual representation of the AST node
   */
  text() : string{
    return
  }
  accept(visitor: ASTVisitor):void{
  }

  
}

interface ASTVisitor{

  visit(n:ASTNode):void

}
export {ASTVisitor,ASTNode}