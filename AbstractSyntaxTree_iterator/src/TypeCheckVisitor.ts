import {ASTNode,ASTVisitor} from "./ASTNode";
import DeclStmt from "./DeclStmt";
import find_duplicates from "./find_duplicates";
import ITypeCheckError from "./ITypeCheckError";
import PlusExpr from "./PlusExpr";
import find_inconsist from "./find_inconsist";

class TypeCheckVisitor implements ASTVisitor{
    
    private all_decl:Array<DeclStmt>
    private all_plusExpr:Array<PlusExpr>

    public constructor(){
        this.all_decl=[]
        this.all_plusExpr=[]
    }

    public getErrors():Array<ITypeCheckError> {

        let array1=(new find_duplicates()).find_duplicates(this.all_decl)
        let array2=(new find_inconsist()).find_inconsist(this.all_plusExpr)

        //let c = array1.map((err) => err.toString())
        //let d= array2.map((err) => err.toString())
        //console.log('array1 is',c)
        //console.log('array2 is',d)

        //console.log('all_decl is',this.all_decl)

        return array1.concat(array2)
    }

    visit(expr: ASTNode): void {

        if (expr instanceof DeclStmt){
            this.all_decl.push(expr)
            //this.declarations.push(expr.getVarname())
        }

        if (expr instanceof PlusExpr){
            this.all_plusExpr.push(expr)
        }
    }
}

export default TypeCheckVisitor