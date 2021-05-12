import ISorter from "../ISorter";

/**
 * Place your second Task 2 implementation of an efficient sorter (e.g. Merge sort, heap sort, quicksort, shell sort) here.
 */
export default class Sorter2<E> implements ISorter<E> {

    constructor() {
    }

    public sort(list: E[], compareFun: (e1: E, e2: E) => number) : void {
        
        if (list.length == 0 || list.length == 1) {
            return
       }

        this.start_sort(list,0,list.length-1,compareFun)
    }

    public merge(list: E[],left:number,middle:number,right:number,compareFun: (e1: E, e2: E) => number){

            // Find sizes of two subarrays to be merged
            let n1 = middle - left + 1;
            let n2 = right - middle;
     
            /* Create temp arrays */
            let left_array = new Array(n1)
            let right_array = new Array(n2)
     
            /*Copy data to temp arrays*/
            for (let i = 0; i < n1; ++i)
                left_array[i] = list[left + i];
            for (let j = 0; j < n2; ++j)
                right_array[j] = list[middle + 1 + j];
     
     
            // Initial indexes of first and second subarrays
            let i = 0, j = 0;
     
            // Initial index of merged subarry array
            let k = left;
            while (i < n1 && j < n2) {
                if (compareFun(left_array[i],right_array[j])<=0) {
                    list[k] = left_array[i];
                    i++;
                }
                else {
                    list[k] = right_array[j];
                    j++;
                }
                k++;
            }
     
            /* Copy remaining elements of L[] if any */
            while (i < n1) {
                list[k] = left_array[i];
                i++;
                k++;
            }
     
            /* Copy remaining elements of R[] if any */
            while (j < n2) {
                list[k] = right_array[j];
                j++;
                k++;
            }
        }
     
        // Main function that sorts arr[l..r] using merge()
        public start_sort(list: E[],left:number,right:number,compareFun: (e1: E, e2: E)=> number){
            if (left < right) {
                // Find the middle point
                let middle = Math.floor((left + right) / 2);
     
                // Sort first and second halves
                this.start_sort(list, left, middle,compareFun);
                this.start_sort(list, middle + 1, right,compareFun);
     
                // Merge the sorted halves
                this.merge(list, left, middle, right,compareFun);
            }
        }

    }
