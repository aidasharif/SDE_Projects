import * as esprima from 'esprima';
import * as estraverse from 'estraverse';
import { PlagiarismInstance, PlagiarismInstanceFactory } from './PlagiarismInstance';
import IComparator from './IComparator';
import ProjectComparator from './ProjectComparator';
import FileUploader from './FileUploader';
import { EvalFile } from './EvalFile';

/**
 * Contains a map describing the number of types in a block of code. Blocks of code
 * include all block statements as described by esprima, including ClassBody and Program.
 */
class CodeBlock {
    // line range over which code block occurs
    range: number[];
    // contains node types from esprima tree as keys
    // values are number of times node type appears in block
    typeCount: Map<string, number>
    variableDeclArray: any[] = [];

    /**
     * Creates an instance of CodeBlock from a number range describing lines of code and
     * a map containing a count of node types in the block.
     * 
     * @param range lines over which block statement occurs in the code
     * @param countVisitor map containing count of node types in block
     */
    constructor(range: number[], typeCount: Map<string, number>) {
        this.range = range;
        this.typeCount = typeCount;
    }
}

export default class ComparatorBuilder {

    // Comparator to be built
    comparator: IComparator

    // create an instance of ProjectComparator to build
    constructor() {
        this.comparator = new ProjectComparator();
    }

    /**
     * Builds instances of plagiarism from project files stored in FileUploader instance.
     */
    buildInstances() : void {

        // get the current instance of FileUploader
        let fileUploader = FileUploader.getInstance();

        // collect files from project 1
        let project1Files: EvalFile[] = fileUploader.getProject1();
        // create codeblocks describing node types in block statements for files in project 1
        let range1Map: Map<String, CodeBlock[]> = this.getFileRangeMap(project1Files);

        // collect files from project 2
        let project2Files: EvalFile[] = fileUploader.getProject2();
        // create codeblocks describing node types in block statements for files in project 2
        let range2Map: Map<String, CodeBlock[]> = this.getFileRangeMap(project2Files);

        // create new set of instances
        let instances: PlagiarismInstance[] = [];

        // iterate through files in project 1
        range1Map.forEach((codeBlocks1, fileName1) => {
            // iterate through the codeblocks for the current file in project 1
            for (let i = 0; i < codeBlocks1.length; ++i) {
                // collect the line range from the codeblock at i in codeblocks array for file in project 1
                let currentProject1Range = codeBlocks1[i].range;
                // collect the countVisitor from the codeblock at i in codeblocks array for file in project 1
                let currentProject1TypeCount = codeBlocks1[i].typeCount;
                let v1Array = codeBlocks1[i].variableDeclArray;

                // iterate through the files in project 2
                range2Map.forEach((codeBlocks2, fileName2) => { 
                    // iterate through all code blocks in file from project 2
                    for (let j = 0; j < codeBlocks2.length; ++j) {
                        // collect the line range from the codeblocks at j in codeblocks arrat for file in project 2
                        let currentProject2Range = codeBlocks2[j].range;
                        // collect the countVisitor from the codeblock at j in codeblocks array for file in project 2
                        let currentProject2TypeCount = codeBlocks2[j].typeCount;
                        let v2array = codeBlocks2[j].variableDeclArray;

                        // iterate through the node types in the codeblock from file in project 2
                        let matches = 0;
                        currentProject2TypeCount.forEach((count, type) => {
                            // if the node type from file in project 2 exists in the map for the codeblock for file
                            // in project 1 and they have the same account, they appear same number of times in
                            // corresponding blocks, record match
                            if (currentProject1TypeCount.get(type) == count) {
                                ++matches;
                            }
                        })



                        // get the size of the larger countVisitor to ensure larger, encompassing instance of
                        // plagiarism is recorded
                        let checkSize: number = Math.max(
                            currentProject1TypeCount.size, 
                            currentProject2TypeCount.size
                        )
                        // if the number of matches is equal to the number of keys in the
                        // larger of the two maps, all node types are found from other map,
                        // is plagiarism instance
                        if (matches == checkSize) {
                            // generate new instance of plagiarism, recording filenames and ranges
                            let newInstance = PlagiarismInstanceFactory(
                                fileName1.toString(), 
                                fileName2.toString(),
                                currentProject1Range[0], 
                                currentProject1Range[1], 
                                currentProject2Range[0], 
                                currentProject2Range[1]
                            )
                            // append instance to array of instances
                            instances.push(newInstance);
                        } 
                                                
                        // Handle Variable Decl Instance here:
                        // Iterate through every varaiable declaration instances
                        // and compare based on the following criteria
                        // If variable name is same, regard them as plagiarism
                        // If variable name is different but value is same,
                        // also regard them as plagiarism
                         v1Array.forEach(v1I => {
                             v2array.forEach(v2I => {
                                 if((v1I[3] == v2I[3] && v1I[4] == v2I[4]) || (v1I[3] == v2I[3] && v1I[2] == v2I[2])){
                                     let newInstance = PlagiarismInstanceFactory(
                                         fileName1.toString(),fileName2.toString(),
                                         v1I[0],v1I[1],v2I[0],v2I[1]
                                     );
                                     instances.push(newInstance);
                                 } 
                             });
                         });


                    }
                })
            }
        })

        // sort the instances such that the instances in the first project and occur first 
        // in each file are at the front of array -- is important for following deletion algorithm
        instances.sort((i1: PlagiarismInstance, i2: PlagiarismInstance) => { 
            return i1.file1StartLine - i2.file1StartLine;
        });

        // remove all instances of plagiarism scoped in other instances of plagiarism
        let toRemove: number[] = [];
        // iterate through instances starting from beginning of array
        for (let i = 0; i < instances.length; ++i) {

            // collect values from instance at i
            let fileName1A = instances[i].filename1;
            let fileName2A = instances[i].filename2;
            let file1StartA = instances[i].file1StartLine;
            let file1EndA = instances[i].file1EndLine;
            let file2StartA = instances[i].file2StartLine;
            let file2EndA = instances[i].file2EndLine;

            // iterate through instances starting at i + 1 to ensure no backtracking or double counting of
            // same instance
            for (let j = i + 1; j < instances.length; ++j) {

                // collect values from isntance at j
                let fileName1B = instances[j].filename1;
                let fileName2B = instances[j].filename2;
                let file1StartB = instances[j].file1StartLine;
                let file1EndB = instances[j].file1EndLine;
                let file2StartB = instances[j].file2StartLine;
                let file2EndB = instances[j].file2EndLine;

                    // if the file names match
                if (   fileName1A.localeCompare(fileName1B) == 0
                    && fileName2A.localeCompare(fileName2B) == 0
                    // and the start line in the first instance is less than the start line in the second instance
                    && file1StartA <= file1StartB
                    // and the end line in first instance is after line in second instance
                    && file1EndA >= file1EndB
                    // and the end line in the first instance is greater than the end line in the
                    // second instance
                    && file2StartA <= file2StartB
                    // and end line in first instance is greater than the end line in second instance
                    && file2EndA >= file2EndB) {
                    
                    // instance at j exists within the instance at i
                    // mark second instance for deletion
                    toRemove.push(j);
                }
            }
        }

        // remove any duplicates (instances in instances in instances)
        toRemove = [...new Set(toRemove)];

        // sort instances by index
        toRemove.sort((i1: number, i2: number) => { 
            return i1 - i2;
        });

        // remove nested instances of plagiarism starting at closest to last instance
        for (let i = toRemove.length - 1; i >= 0; --i) {
            instances.splice(toRemove[i], 1);
        }

        // set instances of plagiarism in comparator
        this.comparator.setPlagiarismInstances(instances);
    }

    /**
     * Generates a file/range map that contains the maps that detail the types in each
     * block within a file.
     * 
     * @param project set of files to generate maps for
     */
    private getFileRangeMap(project: EvalFile[]) : Map<string, CodeBlock[]> {

        // create new range map that
        // string is filename, codeblocks are distinct blocks of code that have
        // been evaluated for that file
        let rangeMap = new Map<string, CodeBlock[]>();

        // iterate through all files in the project
        for (let i = 0; i < project.length; ++i) {
            let fileName = project[i].getFileName();
            let fileContents = project[i].getContents();
            // produce codeblocks for all distinct blocks in file code
            let codeBlocks: CodeBlock[] = this.getCodeBlocks(fileContents);
            
            // associate filename with the code blocks
            rangeMap.set(fileName, codeBlocks);
        }

        // return the range map
        return rangeMap;
    }

    /**
     * Gets blocks of code and the types of identifiers inside each block of code for a 
     * project file.
     * 
     * @param program the contents of the file to be evaluated
     */
    private getCodeBlocks(program: string) : CodeBlock[] {
        // create types ast using esprima
        // collect 'loc' to determine ranges in code
        let ast = esprima.parseScript(program, { loc: true });

        //varray here is the set of declaration instances
        //We don't add duplcate declaration statement to codeblock 
        let varray:String[] = [];
        // create codeBlocks array to hold each block
        let codeBlocks: CodeBlock[] = [];
        estraverse.traverse(ast, {
            enter: (node)=> {

                // if empty statement, attempt to avoid garbage code detection
                // return and do not count
                if (node.type === 'EmptyStatement') { return; }

                // if node indicates a unique block of code in the file, generate new code block
                // over the range of the block statement
                if (node.type === 'BlockStatement' || node.type === 'ClassBody' || node.type == 'Program') {
                    let range = node.loc;
                    let lines = [ range.start.line, range.end.line]
                    
                    // set the range as the unique key and a new map to record types in the block
                    // and associate them with a count
                    codeBlocks.push(new CodeBlock(lines, new Map()));
                }

                // iterate through all codeblocks thus far
                for (let i = 0; i < codeBlocks.length; ++i) {
                    // get tye/count map associated with code block
                    let mMap: Map<string, number> = codeBlocks[i].typeCount;
                    // get range from codeblack
                    let r: number[] = codeBlocks[i].range;
                    let start: number = r[0];
                    let end: number = r[1];
                    let vstmt = codeBlocks[i].variableDeclArray;
                    
                    // if the node falls in the range of the code block, gather its type
                    // and insert into code block
                    if (node.loc.start.line >= start && node.loc.end.line <= end) {
                        // //Adding variable decl here:
                        if(node.type == "VariableDeclaration"){

                            let decl = node['declarations'];
                            //Iterate each declarator
                            decl.forEach(declarator => {
                                if (declarator.id.type == "Identifier" 
                                    && declarator.init.type == "Literal"
                                    && declarator.init 
                                    && declarator.init.value) { 
                                    
                                    //Get the start line, endline, variable name
                                    //variable value, and value type
                                    let st = declarator.loc.start.line;
                                    let ed = declarator.loc.end.line;
                                    let name = declarator.id.name
                                    let v = declarator.init.value;
                                    let vi = [st,ed, name, typeof(v),v];
                                    
                                    // If the instance already push into another block code,
                                    // we do not need to add it again 
                                    if(!varray.includes(JSON.stringify(vi))){
                                        vstmt.push(vi);
                                        varray.push(JSON.stringify(vi));
                                    }
                                }
                            });
                        }

                        let type = node.type.toString();
                        // differentiate between numeric, string, and boolean literals
                        if (node.type == 'Literal') {
                            // if literal type is number, mark as numeric literal
                            switch (typeof(node.value)) {
                                case "number":
                                    type = "NumericLiteral";
                                    break;
                                case "string":
                                    type = "StringLiteral";
                                    break;
                                case "boolean":
                                    type = "BooleanLiteral"
                                    break;
                            }
                            // if not one of these, leave as generic Literal
                        }

                        // differentiate between diff binary expressions
                        if (node.type == 'BinaryExpression') {
                            switch(node.operator) {
                                case '*':
                                    type = "MultiplicationExpression";
                                    break;
                                // combine these with fall-through
                                case "!=":
                                case "!==":
                                    type = "NotEqualsExpression";
                                    break;
                                case "%":
                                    type = "ModExpression";
                                    break;
                                case "&":
                                    type = "BitAndExpression";
                                    break;
                                case "**":
                                    type = "ExponentExpression";
                                    break;
                                case "+":
                                    type = "PlusExpression";
                                    break;
                                case "-":
                                    type = "MinusExpression";
                                    break;
                                case "/":
                                    type = "DivisionExpression";
                                    break;
                                case "<":
                                    type = "LessThanExpression";
                                    break;
                                case "<<":
                                    type = "LeftShiftExpression";
                                    break;
                                case "<=":
                                    type = "LessThanOrEqualToExpression";
                                    break;
                                // let these fall through
                                case "==":
                                case "===":
                                    type = "IsEqualExpression";
                                    break;
                                case ">":
                                    type = "GreaterThanExpression";
                                    break;
                                case ">=":
                                    type = "GreaterThanOrEqualToExpression";
                                    break;
                                case ">>":
                                case ">>>":
                                    type = "RightShiftExpression";
                                    break;
                                case "^":
                                    type = "AndOrExpression";
                                    break;
                                case "in":
                                    type = "InExpression";
                                    break;
                                case "instanceof":
                                    type = "InstanceOfExpression";
                                    break;
                                case "|":
                                    type = "OrExpression";
                                    break;
                            }
                        }

                        // if the map has collected another node with the same type,
                        // increment count by 1
                        if (mMap.has(type)) {
                            let currVal = mMap.get(type);
                            mMap.set(type, currVal + 1)
                        } 
                        // otherwise, create new entry for type, set count to 1 for first appearance
                        else {
                            mMap.set(type, 1);
                        }
                    }
                }
            }
        })

        // return the codeblocks
        return codeBlocks;
    }

    /**
     * Determines the level of plagiarism according to the number of plagiarised lines
     * versus the total number of lines in the program.
     */
    buildScore(): void {

        // find the total number of lines in all files between both projects
        let fileUploader = FileUploader.getInstance();

        // collect files from projects 1 and 2
        let project1Files = fileUploader.getProject1();
        let project2Files = fileUploader.getProject2();

        // record total lines between all files in projects 1 and 2
        let totalLines: number = 0;

        totalLines += this.countProjectFileLines(project1Files);
        totalLines += this.countProjectFileLines(project2Files);

        // count the total number of lines in all instances of plagiarism
        let instances = this.comparator.getAllPlagiarismInstances();

        let plagiarisedLines: number = 0;

        // create maps to record what lines have been recorded as having plagiarism for project 1
        let project1RecordedLines = new Map<string, Array<number>>();
        project1Files.forEach(file => {
            project1RecordedLines.set(file.getFileName(), []);
        })

        // create maps to record what lines have been recorded as having plagiarism for project 2
        let project2RecordedLines = new Map<string, Array<number>>();
        project2Files.forEach(file => {
            project2RecordedLines.set(file.getFileName(), []);
        })

        // get number of plagiarised lines in all instances
        for (let i = 0; i < instances.length; ++i) {
            let instance = instances[i];
            
            let file1Length = 0;
            // get recorded map for file 1
            let fileRange1 = project1RecordedLines.get(instance.filename1);
            // check all lines in file1 instance
            for (let i = instance.file1StartLine; i < instance.file1EndLine + 1; ++i) {
                // if the line has not been recorded, add to file range 1 and increment length of plagiarised
                // lines for file 1
                if (!fileRange1.includes(i)) {
                    file1Length++;
                    fileRange1.push(i);
                }
            }
            // set filerange1 with newly recorded values to entry for file1 in map
            project1RecordedLines.set(instance.filename1, fileRange1);

            let file2Length = 0;
            // get recorded map for file 2
            let fileRange2 = project2RecordedLines.get(instance.filename2);
            // check all lines in file2 instance
            for (let i = instance.file2StartLine; i < instance.file2EndLine + 1; ++i) {
                // if the line has not been recorded, all to file range 2 and increment length of plagiarised
                // lines for file 2
                if (!fileRange2.includes(i)) {
                    file2Length++;
                    fileRange2.push(i);
                }
            }
            // set filerange2 with newly recorded values to entry for file2 in map
            project1RecordedLines.set(instance.filename2, fileRange2);

            // sum plagiarised lines for instance 1 and 2 and add to total plagiarised lines
            plagiarisedLines += (file1Length + file2Length);
        }

        // calculate the total score by dividing total plagiarised lines by number of total
        // lines in the project
        let totalScore = plagiarisedLines / totalLines;
        // multiply total score by 10000, floor it, and then divide by 100 to get percentage
        // out of 100 to 2 decimal places
        totalScore = Math.floor(totalScore * 10000) / 100;

        // set the score in the comparator
        this.comparator.setScore(totalScore);
    }

    /**
     * Counts the total number of lines between all files in a project.
     * 
     * @param project project whose lines are to be counted.
     */
    private countProjectFileLines(project: EvalFile[]) : number {

        // iterate through all contents in each file and count
        // total lines
        let count: number = 0;
        for (let i = 0; i < project.length; ++i) {
            // get code for file
            let lines = project[i].getContents();
            // split code by newline
            let lineArray = lines.split('\n');
            // add number of lines to count
            count += lineArray.length;
        }

        // return number of lines in project
        return count;
    }

    /**
     * Returns the comparator. Should be called after all other needed calls.
     */
    getComparator() : IComparator {

        return this.comparator;
    }
}