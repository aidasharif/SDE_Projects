import {ASTNode} from "./ASTNode";
import Iterator1 from "./Iterator1";
import stmVisitor from "./stmVisitor";

class make_iteratorList{

    private stmtVisit: stmVisitor
    private this_list
    private expr: ASTNode
    constructor(expr: ASTNode){
        this.stmtVisit=new stmVisitor()
        this.expr=expr
        expr.accept(this.stmtVisit)
    }

    public statement_list(){
        this.this_list=this.stmtVisit.getList()
        return this.this_list
    }

    get_iterator(){
        let it=new Iterator1(this.this_list)
        return it
    }

}

export default make_iteratorList