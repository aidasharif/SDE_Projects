import DeclStmt from "./DeclStmt";
import ITypeCheckError from "./ITypeCheckError";

class DuplicateDeclarationError implements ITypeCheckError{

    private error: DeclStmt
    public constructor(error: DeclStmt){
        this.error=error
    }
    
    public toString():string{
        return "Duplicate variable declaration: "+this.error.getVarname()
    }

    find_duplicates1(all_decl:Array<DeclStmt>):Array<ITypeCheckError>{
        let array_duplicate=[]
        //console.log('all_decl is',all_decl)

        for(var i = 0; i < all_decl.length-1; i++){
            for (var j = i+1; j < all_decl.length; j++){
                if( all_decl[i].getVarname()===all_decl[j].getVarname()){
                    //console.log('in find_dup',all_decl[i])
                    array_duplicate.push(new DuplicateDeclarationError(all_decl[i]))
                }
            }
        }
        return array_duplicate
    }
}

export default DuplicateDeclarationError