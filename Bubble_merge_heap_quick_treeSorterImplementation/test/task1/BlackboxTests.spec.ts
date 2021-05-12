import { expect } from 'chai';
import SorterFactory from "../../src/SorterFactory";
const sorterFactory = new SorterFactory();
const sorterFactory1 = new SorterFactory("BubbleSorter");


/**
 * This is not a very good test, but is provided as an example of how
 * to implement a test on the sorter. Implement your task 1 tests here, and feel
 * free to replace this one.
 */

describe("blackbox tests for sorter", () => {

    let sorter = sorterFactory.createSorter();
    //this is made for white box test of bubblesort switch
    let sorter1 = sorterFactory1.createSorter();


    //compare function for string length comparison
    function string_length_compareF(s1:string,s2:string){

        if (s1.length!=s2.length){
            return s1.length - s2.length
        }
        else{
            return s1.localeCompare(s2)
        }
    }

    //compare function for array of arrays based on array size
    function array_length_compareF(s1:number [],s2:number[]){

        if (s1.length==0 && s1.length==0){
            return 0
        }
        if (s1.length!=s2.length){
            return s1.length - s2.length
        }
        else{
            return s1[0]-s2[0]
        }
    }

    //sorts strings based on alphabetic order of characters
    //if they are the same size sort based on first element
    function str_sorter_alphab(list: string []){
        sorter1.sort(list, (s1: string, s2: string) => s1.localeCompare(s2));
    }

    //sorts strings based on their length
    function str_sorter_length(list: string []){
        sorter.sort(list, (s1: string, s2: string) => string_length_compareF(s1,s2));
    }


    function number_sorter(list: number []){
        sorter.sort(list, (s1: number, s2: number) => s1 - s2);
    }

    function bool_sorter(list: boolean []){
        sorter.sort(list, (s1: boolean, s2: boolean) => (s1 === s2)? 0 : s1? -1 : 1);
    }

    
    describe("Boolean Sorter tests", () => {

        it("1-call sorter on a small array of boolean", () => {
            let list = [true, false, true, false];
            bool_sorter(list)
            expect(list).to.have.ordered.members([true,true,false,false]);
        });

        it("3-call sorter on an array of single boolean", () => {
            let list = [false];
            bool_sorter(list)
            expect(list).to.have.ordered.members([false]);
        });

        it("4-call sorter on an array of  boolean with expression", () => {
            let list = [false,false,1>2];
            bool_sorter(list)
            expect(list).to.have.ordered.members([false,false,false]);
        });

        it("5-call sorter on undefined boolean array", () => {
            let list = [undefined];
            bool_sorter(list)
            expect(list).to.have.ordered.members([undefined]);
        });

        it("6-call sorter on null boolean array", () => {
            let list = [null];
            bool_sorter(list)
            expect(list).to.have.ordered.members([null]);
        });


        it("7-call sorter on an array of empty boolean", () => {
            let list = [];
            bool_sorter(list)
            expect(list).to.have.ordered.members([]);
        });

    })


    describe("String alphabetic Sorter tests", () => {

        it("1-call sorter on single string array", () => {
            let list = ['ab'];
            str_sorter_alphab(list) 
            expect(list).to.have.ordered.members(['ab']);
        });

        it("2-call sorter on a very very long string array", () => {
            let list=['gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu','gfrgrtgrgrtgr','aaaaaaa','a','aa','aaaaaaa','tt','uuuuuu']
            str_sorter_alphab(list) 
            expect(list).to.have.ordered.members(['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'gfrgrtgrgrtgr', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'tt', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu', 'uuuuuu']);
        });

        it("3-call sorter on empty string array", () => {
            let list = [];
            str_sorter_alphab(list) 
            expect(list).to.have.ordered.members([]);
        });

        it("4-call sorter on small array of strings of one character", () => {
            let list = ['a','b','d','a'];
            str_sorter_alphab(list) 
            expect(list).to.have.ordered.members(['a','a','b','d']);
        });

        it("5-call sorter on small array of strings", () => {
            let list = ['abb','bbs','rtd','zzzz'];
            str_sorter_alphab(list) 
            expect(list).to.have.ordered.members([ 'abb', 'bbs', 'rtd', 'zzzz' ]);
        });

        it("6-call sorter on undefined string array", () => {
            let list = [undefined];
            str_sorter_alphab(list) 
            expect(list).to.have.ordered.members([undefined]);
        });

        it("7-call sorter on undefined string array", () => {
            let list = [null];
            str_sorter_alphab(list) 
            expect(list).to.have.ordered.members([null]);
        });

        it("8-call sorter on undefined and null string array", () => {
            let list = [null,undefined];
            expect(function(){str_sorter_alphab(list) }).to.throw();
        });

        it("9-call sorter on special characters array", () => {
            let list = ['+','/','"','?','.'];
            str_sorter_alphab(list) 
            expect(list).to.have.ordered.members([ '?', '.', '"', '/', '+' ]);
        });

        it("10-call sorter on special characters array with null", () => {
            let list = ['+','/','"','?','.',''];
            str_sorter_alphab(list) 
            expect(list).to.have.ordered.members([ '','?', '.', '"', '/', '+' ]);
        });
    })

    describe("String length Sorter tests", () => {

        it("1-call sorter on small string array", () => {
            let list = ['a','aaa','','aaaa','b','bbb'];
            str_sorter_length(list) 
            expect(list).to.have.ordered.members([ '','a' ,'b','aaa','bbb','aaaa']);
        });


        it("1-call sorter on small string array with real words and special character", () => {
            let list = [',','aida','my', 'name', 'is'];
            str_sorter_length(list) 
            expect(list).to.have.ordered.members([ ',','is','my','aida','name']);
        });


        it("1-call sorter on empty array", () => {
            let list = [];
            str_sorter_length(list) 
            expect(list).to.have.ordered.members([]);
        });

    })


    describe("Number Sorter tests", () => {

        it("1-call sorter on small array of numbers", () => {
            let list = [4, 1, 2];
            number_sorter(list) 
            expect(list).to.have.ordered.members([1, 2, 4]);
        });

        it("2-call sorter on odd number of zeros array", () => {
            let list = [0,0,0];
            number_sorter(list) 
            expect(list).to.have.ordered.members([0,0,0]);
        });

        it("3-call sorter on single zero array of numbers", () => {
            let list = [0];
            number_sorter(list) 
            expect(list).to.have.ordered.members([0]);
        });

        it("3-call sorter on small array of numbers with a negative", () => {
            let list = [4, 1, 2,5,6,-1];
            number_sorter(list) 
            expect(list).to.have.ordered.members([-1,1,2,4,5,6]);
        });

        it("4-call sorter on null number array", () => {
            let list = [];
            number_sorter(list) 
            expect(list).to.have.ordered.members([]);
        });

        it("5-call sorter on undefined array", () => {
            let list = [undefined];
            number_sorter(list) 
            expect(list).to.have.ordered.members([undefined]);
        });

        it("6-call sorter on null array", () => {
            let list = [null];
            number_sorter(list) 
            expect(list).to.have.ordered.members([null]);
        });

        it("7-call sorter on long array of integers", () => {
            let list = [2,4,5,6,1,9,0,0,0,0,0,3,2,4,5,6,7,2,4,5,6,1,9,0,0,0,0,0,3,2,4,5,6,7,2,4,5,6,1,9,0,0,0,0,0,3,2,4,5,6,7,2,4,5,6,1,9,0,0,0,0,0,3,2,4,5,6,7,2,4,5,6,1,9,0,0,0,0,0,3,2,4,5,6,7,2,4,5,6,1,9,0,0,0,0,0,3,2,4,5,6,7,2,4,5,6,1,9,0,0,0,0,0,3,2,4,5,6,7,2,4,5,6,1,9,0,0,0,0,0,3,2,4,5,6,7,2,4,5,6,1,9,0,0,0,0,0,3,2,4,5,6,7,2,4,5,6,1,9,0,0,0,0,0,3,2,4,5,6,7,2,4,5,6,1,9,0,0,0,0,0,3,2,4,5,6,7,2,4,5,6,1,9,0,0,0,0,0,3,2,4,5,6,7,2,4,5,6,1,9,0,0,0,0,0,3,2,4,5,6,7,2,4,5,6,1,9,0,0,0,0,0,3,2,4,5,6,7,2,4,5,6,1,9,0,0,0,0,0,3,2,4,5,6,7,2,4,5,6,1,9,0,0,0,0,0,3,2,4,5,6,7,2,4,5,6,1,9,0,0,0,0,0,3,2,4,5,6,7,2,4,5,6,1,9,0,0,0,0,0,3,2,4,5,6,7,444444,6556565,323242422,99898];
            number_sorter(list) 
            expect(list).to.have.ordered.members([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 99898, 444444, 6556565, 323242422]);
        });

        it("8-call sorter on an array with a number larger than MAX_SAFE_INTEGER ", () => {
            let list = [900719925474099200434343,1,2,6,7];
            number_sorter(list) 
            expect(list).to.have.ordered.members([1,2,6,7,9.007199254740992e+23]);
        });

        it("9-call sorter on empty dictionary array", () => {
            let list = []
            number_sorter(list) 
            expect(list).to.deep.equal([])
        });

        it("10-call sorter on very large numbers array", () => {
            let list = [10**308,5353453535434646456483742943753859284829429490284024029840298402,1,2,5,0,-987598375983759]
            number_sorter(list) 
            expect(list).to.have.ordered.members([-987598375983759,0,1,2,5,5.353453535434647e+63,10**308]);
        });

        it("11-call sorter on null array", () => {
            let list = [0,Math.max()]
            number_sorter(list) 
            expect(list).to.have.ordered.members([(Math.max()+10),0]);
        });

        it("12-call sorter on strange numbers array", () => {
            let list = [0,-Math.max(),Math.max(),1.1,5.9,1.000000000000001,1.000000000000002]
            number_sorter(list) 
            expect(list).to.have.ordered.members([(Math.max()+10),0,1.000000000000001,1.000000000000002,1.1,5.9,-Math.max()]);
        });

        it("13-call sorter on strange numbers array", () => {
            let list = [0*99,9,11,66/2]
            number_sorter(list) 
            expect(list).to.have.ordered.members([0,9,11,33]);
        });
        
    })


    describe("Array of arrays, and dictionary sorter tests", () => {

        it("1-call sorter on single dict", () => {
            let list = [{ name: 'And', value: 495 }];
            sorter.sort(list, (s1:{name:string,value:number} , s2: {name:string,value:number}) => s1.name.localeCompare(s2.name));
            expect(list).to.deep.equal([{ name: 'And', value: 495 }]);
        });

        it("2-call sorter on list of arrays", () => {
            let list = [[1],[4],[9,11,34,5],[-11,33]]
            sorter.sort(list, (s1:number[] , s2:number[]) => s1[0]-s2[0]);
            expect(list).to.deep.equal([[-11,33],[1],[4],[9,11,34,5]])
        });


        it("3-call sorter on list of arrays and sort based on length of each array", () => {
            let list = [[4,5],[9,11,34,5],[2],[-11,33,44],[1]]
            sorter.sort(list, (s1:number[] , s2:number[]) => array_length_compareF(s1,s2));
            expect(list).to.deep.equal([[1],[2],[4,5],[-11,33,44],[9,11,34,5]])
        });

        it("4-call sorter on dictionary array and sorting based on value number", () => {
            let list = [
                { name: 'Edward', value: 21 },
                { name: 'Sharpe', value: 37 },
                { name: 'And', value: 45 },
                { name: 'The', value: -12 },
                { name: 'Magnetic', value: 13 }]
            sorter.sort(list, (s1:{name:string,value:number} , s2: {name:string,value:number}) => s1.value-s2.value);
            expect(list).to.deep.equal([
                { name: 'The', value: -12 },
                { name: 'Magnetic', value: 13 },
                { name: 'Edward', value: 21 },
                { name: 'Sharpe', value: 37 },
                { name: 'And', value: 45 }]);
        });

        it("5-call sorter on dictionary array and sorting based on name string", () => {
            let sorter = sorterFactory.createSorter();
            let list = [
                { name: 'Edward', value: 21 },
                { name: 'Sharpe', value: 37 },
                { name: 'The', value: -12 },
                { name: 'And', value: 495 },
                { name: 'Magnetic', value: 13 }]
            sorter.sort(list, (s1:{name:string,value:number} , s2: {name:string,value:number}) => s1.name.localeCompare(s2.name));
            expect(list).to.deep.equal([
                { name: 'And', value: 495 },
                { name: 'Edward', value: 21 },
                { name: 'Magnetic', value: 13 },
                { name: 'Sharpe', value: 37 },
                { name: 'The', value: -12 }])
        });

        it("6-call sorter on dictionary array with duplicates", () => {
            let list = [
                { name: 'Edward', value: 21 },
                { name: 'Sharpe', value: 37 },
                { name: 'And', value: 495 },
                { name: 'The', value: -12 },
                { name: 'And', value: 495 },
                { name: 'Magnetic', value: 13 },
                { name: 'And', value: 495 }]
            sorter.sort(list, (s1:{name:string,value:number} , s2: {name:string,value:number}) => s1.name.localeCompare(s2.name));
            expect(list).to.deep.equal([
                { name: 'And', value: 495 },
                { name: 'And', value: 495 },
                { name: 'And', value: 495 },
                { name: 'Edward', value: 21 },
                { name: 'Magnetic', value: 13 },
                { name: 'Sharpe', value: 37 },
                { name: 'The', value: -12 }])
        });
    })
})