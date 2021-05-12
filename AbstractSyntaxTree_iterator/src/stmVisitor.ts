import Assignment from "./Assignment";
import {ASTNode,ASTVisitor} from "./ASTNode";
import DeclStmt from "./DeclStmt";
import Sequence from "./Sequence";
import Stmt from "./Stmt";


class stmVisitor implements ASTVisitor {
    private list_stm:Array<Stmt>

    public constructor(){
        this.list_stm=[]
     }

     public visit(expr: ASTNode){
        
        if (expr instanceof Assignment){
            this.list_stm.push(expr)
            //console.log("expr instanceof Assignment")
        }
        if (expr instanceof DeclStmt){
            this.list_stm.push(expr)
        }

        if (expr instanceof Sequence){
            this.visit(expr.stat1)
            this.visit(expr.stat2)  
            //console.log("expr instanceof sequence")
        }
     }

     public getList(){
         return this.list_stm
     }
  }

  export default stmVisitor