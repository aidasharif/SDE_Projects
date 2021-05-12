import Expr from './Expr'

/**
 * ASTNode representing a literal 
 */
abstract class LiteralExpr extends Expr {
  text() : string{
    return
  }
}

export default LiteralExpr