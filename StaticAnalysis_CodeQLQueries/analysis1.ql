import javascript


predicate funcs_less_5perCmnt(Function func){
    //finding numbe of lines of comments (getNumberOfLinesOfComments method)
    //in func and checking if it is less than 5% of the
    // total number of lines (getNumberOfLines method) in it
    //since we don't have double I multiplied both sides by 100 
    func.getNumberOfLinesOfComments()*100< func.getNumberOfLines()*5
}

//Task: identify functions where of all lines in the function, 
//fewer than 5% are comments

//since we are looking for functions we use Function func
from Function func
//calling the predicate to perform the search
where funcs_less_5perCmnt(func)
//returning the function
select func