import Assignment from "./Assignment";
import {ASTNode} from "./ASTNode";
import {ASTVisitor} from "./ASTNode";
import DeclStmt from "./DeclStmt";
import NumericLiteral from "./NumericLiteral";
import PlusExpr from "./PlusExpr";
import Sequence from "./Sequence";
import StringLiteral from "./StringLiteral";
import VarExpr from "./VarExpr";


class CountVisitor implements ASTVisitor {
    private nrAssignment:number
    private nrDeclStmt:number
    private nrNumericliteral:number
    private nrPlusexpr:number
    private nrSequence:number
    private nrStringLiteral:number
    private nrVarexpr:number
 
    public constructor(){
        this.nrAssignment=0
        this.nrDeclStmt=0
        this.nrNumericliteral=0
        this.nrPlusexpr=0
        this.nrSequence=0
        this.nrStringLiteral=0
        this.nrVarexpr=0
     }

     public visit(expr: ASTNode){
         
        if (expr instanceof NumericLiteral){
            this.nrNumericliteral+=1
        }
        if (expr instanceof Assignment){
            this.nrAssignment+=1
        }
        if (expr instanceof DeclStmt){
            this.nrDeclStmt+=1
        }
        if (expr instanceof PlusExpr){
            this.nrPlusexpr+=1
        }
        if (expr instanceof Sequence){
            this.nrSequence+=1
        }
        if (expr instanceof StringLiteral){
            this.nrStringLiteral+=1
        }
        if (expr instanceof VarExpr){
            this.nrVarexpr+=1
        }
     }

    public getNrAssignment(){
        return this.nrAssignment
    }
    
    public getNrDeclStmt(){
        return this.nrDeclStmt
    }
    public getNrNumericLiteral(){
        return this.nrNumericliteral
    }
    public getNrPlusExpr(){
        return this.nrPlusexpr
    }
    public getNrSequence(){
        return this.nrSequence
    }
    public getNrStringLiteral(){
        return this.nrStringLiteral

    }
    public getNrVarExpr(){
        return this.nrVarexpr
    }
  }

  export default CountVisitor