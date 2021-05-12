import { expect } from 'chai';
import Assignment from '../src/Assignment';
import DeclStmt from '../src/DeclStmt';
import NumericLiteral from '../src/NumericLiteral';
import PlusExpr from '../src/PlusExpr';
import Sequence from '../src/Sequence';


describe("StmtIteratorTests", () => {
    console.log('here111111')

    it("iterator through the statements of a small AST", () => {
        let one = new NumericLiteral(1);
        let three = new NumericLiteral(3); 
        let exp = new PlusExpr(one, three);
        let decl = new DeclStmt("x");
        let assign = new Assignment("x", exp);
        let seq = new Sequence(decl, assign); 
        
        let it = seq.stmtIterator();
        expect(it.hasNext()).to.equal(true);
        expect(it.next().text()).to.equal("declare x");
        expect(it.hasNext()).to.equal(true);
        expect(it.next().text()).to.equal("x = 1 + 3");
        expect(it.hasNext()).to.equal(false);
})

it("iterator through the statements of a small AST2", () => {
    let one = new NumericLiteral(1);
    let three = new NumericLiteral(3); 
    let exp = new PlusExpr(one, three);
    let decl1 = new DeclStmt("x");
    let decl2 = new DeclStmt("y");
    let assign1 = new Assignment("x", exp);
    let assign2 = new Assignment("y", exp);
    let seq = new Sequence(new Sequence(decl1, assign1), new Sequence(decl2, assign2)); 
    
    let it = seq.stmtIterator();
    expect(it.hasNext()).to.equal(true);
    expect(it.next().text()).to.equal("declare x");
    expect(it.hasNext()).to.equal(true);
    expect(it.next().text()).to.equal("x = 1 + 3");

    expect(it.hasNext()).to.equal(true);
    expect(it.next().text()).to.equal("declare y");
    expect(it.hasNext()).to.equal(true);
    expect(it.next().text()).to.equal("y = 1 + 3");
    expect(it.hasNext()).to.equal(false);
})

})