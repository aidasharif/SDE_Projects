import { expect } from 'chai';
import Assignment from '../src/Assignment';
import StringLiteral from '../src/StringLiteral'
import NumericLiteral from '../src/NumericLiteral'
import Sequence from '../src/Sequence';
import PlusExpr from '../src/PlusExpr'
import VarExpr from '../src/VarExpr'
import DeclStmt from '../src/DeclStmt';
import CountVisitor from '../src/CountVisitor';
import { convertCompilerOptionsFromJson } from 'typescript';

describe("CountVisitorTests", () => {
    console.log('here1')

    it("count nodes in a small AST", () => {
        let one = new NumericLiteral(1);
        let three = new NumericLiteral(3); 
        let exp = new PlusExpr(one, three);
        let decl = new DeclStmt("x");
        let assign = new Assignment("x", exp);
        let seq = new Sequence(decl, assign); 
        let countVisitor = new CountVisitor();
        seq.accept(countVisitor);

        expect(countVisitor.getNrAssignment()).to.equal(1);
        expect(countVisitor.getNrDeclStmt()).to.equal(1);
        expect(countVisitor.getNrNumericLiteral()).to.equal(2);
        expect(countVisitor.getNrPlusExpr()).to.equal(1);
        expect(countVisitor.getNrSequence()).to.equal(1);
        expect(countVisitor.getNrStringLiteral()).to.equal(0);
        expect(countVisitor.getNrVarExpr()).to.equal(0);
    });

    it("count nodes in a nested sequence AST2", () => {
        let one = new NumericLiteral(1);
        let two = new NumericLiteral(2);
        let three = new NumericLiteral(3); 
        let exp1 = new PlusExpr(one, three);
        let exp2 = new PlusExpr(one, two);
        let decl1 = new DeclStmt("x");
        let decl2 = new DeclStmt("y");
        let assign1 = new Assignment("x", exp1);
        let assign2 = new Assignment("x", exp2);
        let seq = new Sequence(new Sequence(decl1, assign1), new Sequence(decl2, assign2)); 
        let countVisitor = new CountVisitor();
        seq.accept(countVisitor);

        expect(countVisitor.getNrAssignment()).to.equal(2);
        expect(countVisitor.getNrDeclStmt()).to.equal(2);
        expect(countVisitor.getNrNumericLiteral()).to.equal(4);
        expect(countVisitor.getNrPlusExpr()).to.equal(2);
        expect(countVisitor.getNrSequence()).to.equal(3);
        expect(countVisitor.getNrStringLiteral()).to.equal(0);
        expect(countVisitor.getNrVarExpr()).to.equal(0);
    });

    it("count nodes in empty sequence AST3", () => {
        let one = new NumericLiteral(1);
        let two = new NumericLiteral(2);
        expect(function(){ new Sequence(null,null);}).to.throw(Error,'Sequence is empty');
    });

    it("count nodes of varexpr input AST4", () => {

        let varexp1 = new VarExpr('aida');
        let varexp2 = new VarExpr('kooiker');
        let decl1 = new DeclStmt("x");
        let decl2 = new DeclStmt("y");
        let assign1 = new Assignment("x", varexp1);
        let assign2 = new Assignment("y", varexp2);

        let seq = new Sequence(new Sequence(decl1, assign1), new Sequence(decl2, assign2)); 
        let countVisitor = new CountVisitor();
        seq.accept(countVisitor);

        expect(countVisitor.getNrVarExpr()).to.equal(2);
        expect(countVisitor.getNrDeclStmt()).to.equal(2);
        expect(countVisitor.getNrPlusExpr()).to.equal(0);
        expect(countVisitor.getNrSequence()).to.equal(3);
        expect(countVisitor.getNrStringLiteral()).to.equal(0);
    });

    it("count nodes in a nested sequence AST5", () => {
        let one = new NumericLiteral(1);
        let two = new NumericLiteral(2);
        let three = new NumericLiteral(3); 
        let exp1 = new PlusExpr(one, three);
        let exp2 = new PlusExpr(one, two);
        let decl1 = new DeclStmt("x");
        let decl2 = new DeclStmt("y");
        let assign1 = new Assignment("x", exp1);
        let assign2 = new Assignment("x", exp2);
        let seq = new Sequence(new Sequence(decl1, assign1), new Sequence(decl2, assign2)); 
        let countVisitor = new CountVisitor();
        seq.accept(countVisitor);

        expect(countVisitor.getNrAssignment()).to.equal(2);
        expect(countVisitor.getNrDeclStmt()).to.equal(2);
        expect(countVisitor.getNrNumericLiteral()).to.equal(4);
        expect(countVisitor.getNrPlusExpr()).to.equal(2);
        expect(countVisitor.getNrSequence()).to.equal(3);
        expect(countVisitor.getNrStringLiteral()).to.equal(0);
        expect(countVisitor.getNrVarExpr()).to.equal(0);
    });


    it("count nodes in a nested sequence AST6", () => {
        let one = new NumericLiteral(1);
        let two = new NumericLiteral(2);
        let three = new NumericLiteral(3); 
        let exp1 = new PlusExpr(one, three);
        let exp2 = new PlusExpr(one, two);
        let decl1 = new DeclStmt("x");
        let decl2 = new DeclStmt("y");
        let assign1 = new Assignment("x", exp1);
        let assign2 = new Assignment("x", exp2);
        let seq = new Sequence(new Sequence(decl1, assign1), new Sequence(decl2, assign2)); 
        let countVisitor = new CountVisitor();
        seq.accept(countVisitor);

        expect(countVisitor.getNrAssignment()).to.equal(2);
        expect(countVisitor.getNrDeclStmt()).to.equal(2);
        expect(countVisitor.getNrNumericLiteral()).to.equal(4);
        expect(countVisitor.getNrPlusExpr()).to.equal(2);
        expect(countVisitor.getNrSequence()).to.equal(3);
        expect(countVisitor.getNrStringLiteral()).to.equal(0);
        expect(countVisitor.getNrVarExpr()).to.equal(0);
    });


    it("count nodes in a nested sequence AST", () => {
        let one = new NumericLiteral(1);
        let two = new NumericLiteral(2);
        let three = new NumericLiteral(3); 
        let exp1 = new PlusExpr(one, three);
        let exp2 = new PlusExpr(one, two);
        let decl1 = new DeclStmt("x");
        let decl2 = new DeclStmt("y");
        let assign1 = new Assignment("x", exp1);
        let assign2 = new Assignment("x", exp2);
        let seq = new Sequence(new Sequence(decl1, assign1), new Sequence(decl2, assign2)); 
        let countVisitor = new CountVisitor();
        seq.accept(countVisitor);

        expect(countVisitor.getNrAssignment()).to.equal(2);
        expect(countVisitor.getNrDeclStmt()).to.equal(2);
        expect(countVisitor.getNrNumericLiteral()).to.equal(4);
        expect(countVisitor.getNrPlusExpr()).to.equal(2);
        expect(countVisitor.getNrSequence()).to.equal(3);
        expect(countVisitor.getNrStringLiteral()).to.equal(0);
        expect(countVisitor.getNrVarExpr()).to.equal(0);
    });

})