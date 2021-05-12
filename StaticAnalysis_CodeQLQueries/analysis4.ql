import javascript

predicate findFunction(LoopStmt loopStm,DataFlow::InvokeNode iNode){
    //first we check iNodes which the functions they call (using getAcallee method)
    //has less than 5 lines
    iNode.getACallee().getNumberOfLines()<5
    //then we check if the location of this iNode is inside a loop
    //to do so we need to get the loopstatement body and then
    //we find the AST expression of the InvokeNode by getInvokeExpr() method
    //when AST expression we must get the innermost statement to which 
    //the AST expression belongs (by getEnclosingStmt() method)
    //since the loop could consists of several expressions and statements
    //we need to get the paranet statement (by getParent()) method and
    //it must be equal to the loop body (getBody() method)
    and iNode.getInvokeExpr().getEnclosingStmt().getParent()= loopStm.getBody()
    //at last we want to make sure the invoke node is a function
    //and not a method of an object so we check for invoke ndoes 
    //without any method calls
    and not exists(iNode.getAMethodCall())
}

//Task: find functions that have less than 5 lines of code, 
//and are called inside of a loop 

//we need loopstatements we need DataFlow library to find 
//the call site and connect it to the function being called
from LoopStmt loopStm,DataFlow::InvokeNode iNode
//calling the predicate to perform the search
where findFunction(loopStm, iNode)
//since the question is asking for the actual function we need
//to get the Callee of the invoke node
select iNode.getACallee()
