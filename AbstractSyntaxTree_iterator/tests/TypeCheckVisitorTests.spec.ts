import { expect } from 'chai';
import Assignment from '../src/Assignment';
import StringLiteral from '../src/StringLiteral'
import NumericLiteral from '../src/NumericLiteral'
import Sequence from '../src/Sequence';
import PlusExpr from '../src/PlusExpr'
import VarExpr from '../src/VarExpr'
import DeclStmt from '../src/DeclStmt';
import TypeCheckVisitor from '../src/TypeCheckVisitor';

describe("TypeCheckVisitorTests", () => {
    
    it("type-check a small AST with both kinds of errors", () => {
        let x1 = new DeclStmt("x");
        let x2 = new DeclStmt("x");
        let y = new DeclStmt("y");
        let one = new NumericLiteral(1); 
        let two = new StringLiteral("foo"); 
        let exp1 = new PlusExpr(one, two);
        let exp2 = new NumericLiteral(3); 
        let assign1 = new Assignment("x", exp1);
        let assign2 = new Assignment("y", exp2);
        let code = new Sequence(x1, new Sequence(x2, new Sequence(y, new Sequence(assign1, assign2))))
        let tcVisitor = new TypeCheckVisitor();
        code.accept(tcVisitor);
        let expected = ["Duplicate variable declaration: x",
                        "Type error in expression: 1 + \"foo\""]; 
        let errors = tcVisitor.getErrors().map((err) => err.toString())
        expect(errors).to.have.same.members(expected);  // both errors
    })

    it("type-check a small AST with both kinds of errors2", () => {
        let x1 = new DeclStmt("x");
        let x2 = new DeclStmt("x");
        let x3 = new DeclStmt("x");
        let x4 = new DeclStmt("x");
        let y = new DeclStmt("y");
        let z1 = new DeclStmt("z");
        let z2= new DeclStmt("z");
        let z3 = new DeclStmt("z");
        let one = new NumericLiteral(1); 
        let two = new StringLiteral("foo"); 
        let three = new NumericLiteral(111); 
        let four = new NumericLiteral(300); 
        let exp0 = new PlusExpr(three, four);
        let exp1 = new PlusExpr(one, two);
        let exp20= new PlusExpr(two, three);
        let exp2 = new NumericLiteral(3); 
        let assign0 = new Assignment("z", exp0);
        let assign1 = new Assignment("x", exp1);
        let assign2 = new Assignment("y", exp2);
        let assign3 = new Assignment("z", exp20);
        let code = new Sequence(new Sequence(new Sequence(assign3,z2) , new Sequence(x1,x3)), new Sequence(new Sequence(x2,z2), new Sequence(y, new Sequence(assign1, new Sequence(assign2, assign0)))))
        let tcVisitor = new TypeCheckVisitor();
        code.accept(tcVisitor);
        let expected = ["Duplicate variable declaration: x", "Duplicate variable declaration: z","Duplicate variable declaration: x","Duplicate variable declaration: x"
                        ,"Type error in expression: 1 + \"foo\"","Type error in expression: \"foo\" + 111"]; 
        let errors = tcVisitor.getErrors().map((err) => err.toString())
        expect(errors).to.have.same.members(expected);  // both errors
    })

})