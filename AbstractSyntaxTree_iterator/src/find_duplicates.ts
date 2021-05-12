import DeclStmt from "./DeclStmt"
import DuplicateDeclarationError from "./DuplicateDeclarationError"
import ITypeCheckError from "./ITypeCheckError"

class find_duplicates{

    find_duplicates(all_decl:Array<DeclStmt>):Array<ITypeCheckError>{
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


export default find_duplicates