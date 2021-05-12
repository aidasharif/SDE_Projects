import ISorter from "../ISorter";

/**
 * Place your first Task 2 implementation of an efficient sorter (e.g. Merge sort, heap sort, quicksort, shell sort) here.
 */
export default class Sorter1<E> implements ISorter<E> {

    constructor() {
    }
    public sort(list: E[], compareFun: (e1: E, e2: E) => number) : void {

        if (list.length == 0 || list.length == 1) {
            return
       }

        this.quickSort(list,0,list.length-1,compareFun)
        
    }
    
    public quickSort(list: E[],low:number,high:number,compareFun: (e1: E, e2: E) => number){

        if (low<high){
            /* part is partitioning index, arr[pi] is now at right place */
            let part = this.partition(list, low, high,compareFun);
            this.quickSort(list,low,part-1,compareFun);  // Before pi
            this.quickSort(list, part+1,high,compareFun); // After pi
        }
    }


    public partition (list: E[], low:number, high:number,compareFun: (e1: E, e2: E)=> number){
        // pivot (Element to be placed at right position)
        let pivot = list[high];   
         // Index of smaller element
        let i = (low - 1) 


        for (let j = low; j <= high- 1; j++){
        // If current element is smaller than the pivot
            if (compareFun(list[j],pivot)<0){
                // increment index of smaller element
                i++;    
                [list[i],list[j]]=[list[j],list[i]]
            }
        }
        [list[i + 1], list[high]]=[list[high], list[i+1]]

        return (i + 1)
    }
}




