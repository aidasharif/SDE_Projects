import {ASTNode} from './ASTNode'
import make_iteratorList from "./make_iteratorList"
import IIterator from "./IIterator";
import Iterator1 from "./Iterator1";

/**
 * root of the statement subhierarchy.  
 */
abstract class Stmt extends ASTNode {
   
    stmtIterator() : IIterator<Stmt>{
        //let this_list=statement.getList()
        let make_it=new make_iteratorList(this)
        let list_statement=make_it.statement_list()
        if(list_statement==null){
          return new Iterator1<Stmt>([])
        }
        else{
          let it=new Iterator1<Stmt>(list_statement)
          return it
        }
      }
}

export default Stmt