import javascript

predicate className_noSupClass(ClassDefinition cls){
    //using method "getSuperClass" looking for classes
    //where their superclass does not exist
    not exists(cls.getSuperClass())
}

//Task: find the names of classes with no superclass

//we look for classes so we choose cls from ClassDefinition
from ClassDefinition cls
//calling the predicate to perform the search
where className_noSupClass(cls)
//returning the name of those classes by getName() method
select cls.getName()