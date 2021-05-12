import javascript

predicate className_noSupClass(ClassDefinition cls){
    //using method "getSuperClass" looking for classes
    //where their superclass exists
    exists(cls.getSuperClass())
}

// Task: find the names of classes with a superclass 
//together with the name of the superclass

//we look for classes so we choose cls from ClassDefinition
from ClassDefinition cls
//calling the predicate to perform the search
where className_noSupClass(cls)
//returning the name of those classes by getName() method
//as well as names of superclasses
select cls.getName(), cls.getSuperClass().toString()