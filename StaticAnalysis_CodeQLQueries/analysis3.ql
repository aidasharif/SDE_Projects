import javascript

predicate access_constName(PropAccess prop_accss){
    //since constructor.name is a field access,
    //we need to look for property "name" on base "constructor"
    //so we use getPropertyName() methos of the propertyaccess
    //for the base, since it might consists of several tokens
    //we only need to check the last token before "name" and check
    //if it is 'constructor'
    prop_accss.getPropertyName()="name" and prop_accss.getBase().getLastToken().getValue()="constructor"
}

//Task: identify all instances of accesses to constructor.name

//
from PropAccess prop_accss
//calling the predicate to perform the search
where  access_constName(prop_accss)
//returning the whole base+property access
select prop_accss
