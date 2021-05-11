import { expect } from 'chai';
import ComparatorBuilder from '../src/ComparatorBuilder';
import FileUploader from '../src/FileUploader';
import { EvalFile, FileFactory } from '../src/EvalFile';
const path = require('path')
import * as fs from 'fs';
import { PlagiarismInstance } from '../src/PlagiarismInstance';
import IComparator from '../src/IComparator';


/**
 * A test on comparator builder class. Though long, each test case will cover each plagiarism 
 * instances detection mechanism as much as possible 
 */
describe("Tests for the ComparatorBuilder class", () => {
    var fileUploader = FileUploader.getInstance();
    var countVisitorProgram1 = 
    fs.readFileSync(path.resolve(__dirname,"../sample/Project1/CountVisitorOnly1.js"), 'utf-8')
    var countVisitorProgram2 = 
    fs.readFileSync(path.resolve(__dirname,"../sample/Project2/CountVisitorOnly2.js"), 'utf-8')

    /**
     * A test to detect variable rename.
     */
    it("1. Test variable rename", () => {
        let si1 = fs.readFileSync(path.resolve(__dirname,"../sample/Project1/si1.js"), 'utf-8')
        let si2 = fs.readFileSync(path.resolve(__dirname,"../sample/Project2/si2.js"), 'utf-8')
        let si3 = fs.readFileSync(path.resolve(__dirname,"../sample/Project1/si3.js"), 'utf-8')
        fileUploader.clear();   
        // generate project1 and add to file uploader
        let project1: EvalFile[] = [];
        let file1 = FileFactory('si1.js', si1);
        let file3 = FileFactory('si3.js', si3);
        project1.push(file1);
        project1.push(file3);
        fileUploader.addFiles(project1, true);   
        // generate project2 and add to file uploader
        let project2: EvalFile[] = [];
        let file2 = FileFactory('si2.js', si2);
        project2.push(file2);
        fileUploader.addFiles(project2, false);
        let comparator: ComparatorBuilder = new ComparatorBuilder();
        comparator.buildInstances();
        comparator.buildScore();
        let com = comparator.getComparator();
        let pArray: PlagiarismInstance[] = com.getAllPlagiarismInstances();
        let p1 = new PlagiarismInstance("si1.js","si2.js",1,1,11,11);
        let p2 = new PlagiarismInstance("si1.js","si2.js",2,2,3,3);
        expect(JSON.stringify(pArray)).contains(JSON.stringify(p1));
        expect(JSON.stringify(pArray)).contains(JSON.stringify(p2));

        // Test score here 
        let score: number = comparator.getComparator().getScore()
        expect(score).equals(31.81)
    })


    /**
     * Test only counter visitor with variable rename avoided. 
     */
    it("2. Method relocation (judged on count visitors) "+
        "with variable rename avoided, expect only doStuff() is detected", () => {
        fileUploader.clear();

        let project1: EvalFile[] = [];
        let file1 = FileFactory('countvisitoronly1.js', countVisitorProgram1);
        project1.push(file1);
        fileUploader.addFiles(project1, true);  

        let project2: EvalFile[] = [];
        let file2 = FileFactory('countvisitoronly2.js', countVisitorProgram2);
        project2.push(file2);
        fileUploader.addFiles(project2, false);

        let comparator: ComparatorBuilder = new ComparatorBuilder();
        comparator.buildInstances();
        comparator.buildScore();
        let pA: PlagiarismInstance[] = 
        comparator.getComparator().getAllPlagiarismInstances();
        expect(pA.length).equals(1); 
        let i1: PlagiarismInstance = new PlagiarismInstance(
            file1.getFileName(), file2.getFileName(),7,13,5,11
        )
        expect(JSON.stringify(pA)).contains(JSON.stringify(i1));
        // Test score here 
        let score: number = comparator.getComparator().getScore()
        expect(score).equals(38.88)
    })

    /**
     * Method relocation detection. If method is additional line to disrupt count visitor, our 
     * program cannot detect anything
     */
    it("3. Method relocation, disrupt count visitor and variable rename avoided, should detect nothing", () => {

        fileUploader.clear();
        let countVisitorProgram2Mutated = 
        fs.readFileSync(path.resolve(__dirname,"../sample/Project2/CountVisitorOnly2Mutated.js"), 'utf-8')


        let project1: EvalFile[] = [];
        let file1 = FileFactory('countvisitoronly1.js', countVisitorProgram1);
        project1.push(file1);
        fileUploader.addFiles(project1, true);  

        let project2: EvalFile[] = [];
        let file2 = FileFactory('countvisitoronly2Mutated.js', countVisitorProgram2Mutated);
        project2.push(file2);
        fileUploader.addFiles(project2, false);

        let comparator: ComparatorBuilder = new ComparatorBuilder();
        comparator.buildInstances();
        comparator.buildScore();
        let pA: PlagiarismInstance[] = 
        comparator.getComparator().getAllPlagiarismInstances();
        
        expect(pA.length).equals(0); 
        // Test score here 
        let score: number = comparator.getComparator().getScore()
        expect(score).equals(0)
    })

    /**
     * There are two instances A and B, A's range covers B's. So we can discard instnace B
     */
    it("4. If large range cover small range, " + 
        "instances of that smaller range should be discarded" + 
        "If variable rename is detected and its within the range of count visitor, " + 
        "discard the variable rename one", () => {

        fileUploader.clear();
        let RC1 = 
        fs.readFileSync(path.resolve(__dirname,"../sample/Project1/RangeCoverage1.js"), 'utf-8')

        let RC2 = 
        fs.readFileSync(path.resolve(__dirname,"../sample/Project2/RangeCoverage2.js"), 'utf-8')

        let project1: EvalFile[] = [];
        let file1 = FileFactory('RangeCoverage1.js', RC1);
        project1.push(file1);
        fileUploader.addFiles(project1, true);  

        let project2: EvalFile[] = [];
        let file2 = FileFactory('RangeCoverage2.js', RC2);
        project2.push(file2);
        fileUploader.addFiles(project2, false);

        let comparator: ComparatorBuilder = new ComparatorBuilder();
        comparator.buildInstances();
        comparator.buildScore();
        let pA: PlagiarismInstance[] = 
        comparator.getComparator().getAllPlagiarismInstances();
        
        // This plagiarism instance is detected in out algorithm but discarded
        // since count visitor cover over this instance
        let variableRename: PlagiarismInstance = new PlagiarismInstance(
            file1.getFileName(), file2.getFileName(),2,2,2,2
        )

        let countVisitor: PlagiarismInstance = new PlagiarismInstance(
            file1.getFileName(), file2.getFileName(),1,7,1,7
        )
        // Only contain the count visitor instance 
        expect(pA.length).equals(1); 

        expect(JSON.stringify(pA)).not.include(JSON.stringify(variableRename));
        expect(JSON.stringify(pA)).include(JSON.stringify(countVisitor));
        // Test score here 
        let score: number = comparator.getComparator().getScore()
        expect(score).equals(100)
    }) 

    /**
     * Following test above. If instance A cannot cover instance B, keep both instances
     */
    it("5. Follow test #4, " + 
    "without instances of larger range (counter visitor not match/discrupted)" + 
    "Variable rename instances are detected and returned", () => 
    {

        fileUploader.clear();
        let RC1 = 
        fs.readFileSync(path.resolve(__dirname,"../sample/Project1/RangeCoverage1.js"), 'utf-8')

        let RC2Mutated = 
        fs.readFileSync(path.resolve(__dirname,"../sample/Project2/RangeCoverage2Mutated.js"), 'utf-8')

        let project1: EvalFile[] = [];
        let file1 = FileFactory('RangeCoverage1.js', RC1);
        project1.push(file1);
        fileUploader.addFiles(project1, true);  

        let project2: EvalFile[] = [];
        let file2 = FileFactory('RangeCoverage2Mutated.js', RC2Mutated);
        project2.push(file2);
        fileUploader.addFiles(project2, false);

        let comparator: ComparatorBuilder = new ComparatorBuilder();
        comparator.buildInstances();
        comparator.buildScore();
        let pA: PlagiarismInstance[] = 
        comparator.getComparator().getAllPlagiarismInstances();
        
        // This plagiarism instance is detected an returned
        let variableRename1: PlagiarismInstance = new PlagiarismInstance(
            file1.getFileName(), file2.getFileName(),2,2,2,2
        )
        let variableRename2: PlagiarismInstance = new PlagiarismInstance(
            file1.getFileName(), file2.getFileName(),3,3,3,3
        )
        let variableRename3: PlagiarismInstance = new PlagiarismInstance(
            file1.getFileName(), file2.getFileName(),4,4,4,4
        )

        // Count visitor doesnt match, so no such instance listed below
        let countVisitor: PlagiarismInstance = new PlagiarismInstance(
            file1.getFileName(), file2.getFileName(),1,8,1,7
        )
        // Only contain the count visitor instance 
        expect(pA.length).equals(3); 

        expect(JSON.stringify(pA)).include(JSON.stringify(variableRename1));
        expect(JSON.stringify(pA)).include(JSON.stringify(variableRename2));
        expect(JSON.stringify(pA)).include(JSON.stringify(variableRename3));
        expect(JSON.stringify(pA)).not.include(JSON.stringify(countVisitor));

        // Test score here also
        let score: number = comparator.getComparator().getScore()
        expect(score).equals(40)
    })

    /**
     * expect exception when one side doesn't have file
     */
    it("6. Compare files where one side has no files, expect excpetion", () => {
        fileUploader.clear();
        let project1: EvalFile[] = [];
        expect(() => { fileUploader.addFiles(project1, true) }).to.throw(Error,
            "No files uploaded");

    })

    /**
     * Cross product. Each file in project 1 will compare to each file in project 2
     */
    it("7. Compare Project A (f1A.js and f2A.js) with Project B (f1B.js and f2B.js)." + 
        "The total plagiarism instances collected come from comparision between " + 
        "f1A X f1B, f1A X f2B, f2A X f1B, f2A X f2B", () => {
            let comparator: ComparatorBuilder = new ComparatorBuilder();
            fileUploader.clear()

            let f1A = 
            fs.readFileSync(path.resolve(__dirname,"../sample/Project1/f1A.js"), 'utf-8')
            let f1AFile = FileFactory('f1A.js', f1A);
            let f2A = 
            fs.readFileSync(path.resolve(__dirname,"../sample/Project1/f2A.js"), 'utf-8')
            let f2AFile = FileFactory('f2A.js', f2A);
            let f1B = 
            fs.readFileSync(path.resolve(__dirname,"../sample/Project2/f1B.js"), 'utf-8')
            let f1BFile = FileFactory('f1B.js', f1B);
            let f2B = 
            fs.readFileSync(path.resolve(__dirname,"../sample/Project2/f2B.js"), 'utf-8')
            let f2BFile = FileFactory('f2B.js', f2B);
            
            let project1: EvalFile[] = [];
            let project2: EvalFile[] = [];
            // f1A X f1B, f1A X f2B, f2A X f1B, f2A X f2B
            project1.push(f1AFile)
            project1.push(f2AFile)
            project2.push(f1BFile)
            project2.push(f2BFile)

            fileUploader.addFiles(project1, true)
            fileUploader.addFiles(project2, false)

            comparator.buildInstances();

            let total: PlagiarismInstance[] = comparator.comparator.getAllPlagiarismInstances()

            // f1A X f1B
            fileUploader.clear()
            project1 = []
            project2 = []
            project1.push(f1AFile)
            project2.push(f1BFile)
            fileUploader.addFiles(project1, true)
            fileUploader.addFiles(project2, false)
            comparator.buildInstances();
            let f1Af1B: PlagiarismInstance[] = comparator.comparator.getAllPlagiarismInstances()

            // f1A X f2B
            fileUploader.clear()
            project1 = []
            project2 = []
            project1.push(f1AFile)
            project2.push(f2BFile)
            fileUploader.addFiles(project1, true)
            fileUploader.addFiles(project2, false)
            comparator.buildInstances();
            let f1Af2B: PlagiarismInstance[] = comparator.comparator.getAllPlagiarismInstances()

            // f2A X f1B
            fileUploader.clear()
            project1 = []
            project2 = []
            project1.push(f2AFile)
            project2.push(f1BFile)
            fileUploader.addFiles(project1, true)
            fileUploader.addFiles(project2, false)
            comparator.buildInstances();
            let f2Af1B: PlagiarismInstance[] = comparator.comparator.getAllPlagiarismInstances()

            // f2A X f2B
            fileUploader.clear()
            project1 = []
            project2 = []
            project1.push(f2AFile)
            project2.push(f2BFile)
            fileUploader.addFiles(project1, true)
            fileUploader.addFiles(project2, false)
            comparator.buildInstances();
            comparator.buildScore()
            let f2Af2B: PlagiarismInstance[] = comparator.comparator.getAllPlagiarismInstances()


            // The instance from f1Af1B, f1Af2B, f2Af1B, and f2Af2B should have all instance
            // from individual
            f1Af1B.forEach(element => {
                expect(JSON.stringify(total)).contain(JSON.stringify(element))
            });
            f1Af2B.forEach(element => {
                expect(JSON.stringify(total)).contain(JSON.stringify(element))
            });
            f2Af1B.forEach(element => {
                expect(JSON.stringify(total)).contain(JSON.stringify(element))
            });
            f2Af2B.forEach(element => {
                expect(JSON.stringify(total)).contain(JSON.stringify(element))
            });
        // Test score here 
        let score: number = comparator.getComparator().getScore()
        expect(score).equals(0)
    })

    /**
     * Our count visitor is not able to detect interchange of forloop and while statement 
     */
    it("8. Test changed loops from sample code. " + 
        "Our code will not detect the interchange of while and for statement" + 
        " since it decieve count visitor. " + "However, direct method copy will be detected", () => {

            let comparator: ComparatorBuilder = new ComparatorBuilder();
            fileUploader.clear()

            let f1A = 
            fs.readFileSync(path.resolve(__dirname,"../sample/Multifile/ChangedLoops/Student 1/file1a.js"), 'utf-8')
            let f1AFile = FileFactory('f1A.js', f1A);
            let f2A = 
            fs.readFileSync(path.resolve(__dirname,"../sample/Multifile/ChangedLoops/Student 1/file2a.js"), 'utf-8')
            let f2AFile = FileFactory('f2A.js', f2A);
            let f1B = 
            fs.readFileSync(path.resolve(__dirname,"../sample/Multifile/ChangedLoops/Student 2/file1b.js"), 'utf-8')
            let f1BFile = FileFactory('f1B.js', f1B);
            let f2B = 
            fs.readFileSync(path.resolve(__dirname,"../sample/Multifile/ChangedLoops/Student 2/file2b.js"), 'utf-8')
            let f2BFile = FileFactory('f2B.js', f2B);

            let project1: EvalFile[] = [];
            let project2: EvalFile[] = [];
            // f1A X f1B, f1A X f2B, f2A X f1B, f2A X f2B
            project1.push(f1AFile)
            project1.push(f2AFile)
            project2.push(f1BFile)
            project2.push(f2BFile)

            fileUploader.addFiles(project1, true)
            fileUploader.addFiles(project2, false)

            comparator.buildInstances();
            comparator.buildScore();
            var total: PlagiarismInstance[] = comparator.comparator.getAllPlagiarismInstances();

            //At least one instance of ForStatement <=> WhileStatement is this:
            let wantedInstnace: PlagiarismInstance = new PlagiarismInstance(f1AFile.getFileName(),f1BFile.getFileName(),
                13,19,13,21
            )
            
            // But we don't have this instance
            expect(JSON.stringify(total)).not.contain(JSON.stringify(wantedInstnace))

            // Yet, we still can detect direct method copy cases based on count visitor mechanism, one of the instances is this:
            let obtainedInstance: PlagiarismInstance = new PlagiarismInstance(f1AFile.getFileName(),f1BFile.getFileName(),
            31,33,35,37
            )

            // Expect this appear in the report.
            expect(JSON.stringify(total)).contain(JSON.stringify(obtainedInstance)) 
        // Test score here 
        let score: number = comparator.getComparator().getScore()
        expect(score).equals(32.84)           
    })

    /**
     * Throw error when js file has incorrect syntax
     */
    it("9. Compare files with incorrect syntax, expect error from parser ", () => {

        let comparator: ComparatorBuilder = new ComparatorBuilder();
        fileUploader.clear()

        let f1 = 
        fs.readFileSync(path.resolve(__dirname,"../sample/Project1/IncorrectSyntax1.js"), 'utf-8')
        let f1AFile = FileFactory('f1A.js', f1);
        let f2 = 
        fs.readFileSync(path.resolve(__dirname,"../sample/Project2/IncorrectSyntax2.js"), 'utf-8')
        let f2AFile = FileFactory('f2A.js', f2);
        

        let project1: EvalFile[] = [];
        let project2: EvalFile[] = [];

        project1.push(f1AFile)
        project2.push(f2AFile)

        fileUploader.addFiles(project1, true)
        fileUploader.addFiles(project2, false)

        
        expect(() => { comparator.buildInstances(); }).to.throw(Error,
            "Line 1: Unexpected token");
    })

    /**
     * Same as #8, our count visitor cannot detect method extraction
     */
    it("10. Test method extraction from sample code. " , () => {

        let comparator: ComparatorBuilder = new ComparatorBuilder();
        fileUploader.clear()

        let f1A = 
        fs.readFileSync(path.resolve(__dirname,"../sample/Multifile/ExtractedMethods/Student 1/file1a.js"), 'utf-8')
        let f1AFile = FileFactory('f1A.js', f1A);
        let f2A = 
        fs.readFileSync(path.resolve(__dirname,"../sample/Multifile/ExtractedMethods/Student 1/file2a.js"), 'utf-8')
        let f2AFile = FileFactory('f2A.js', f2A);
        let f1B = 
        fs.readFileSync(path.resolve(__dirname,"../sample/Multifile/ExtractedMethods/Student 2/file1b.js"), 'utf-8')
        let f1BFile = FileFactory('f1B.js', f1B);
        let f2B = 
        fs.readFileSync(path.resolve(__dirname,"../sample/Multifile/ExtractedMethods/Student 2/file2b.js"), 'utf-8')
        let f2BFile = FileFactory('f2B.js', f2B);

        let project1: EvalFile[] = [];
        let project2: EvalFile[] = [];
        // f1A X f1B, f1A X f2B, f2A X f1B, f2A X f2B
        project1.push(f1AFile)
        project1.push(f2AFile)
        project2.push(f1BFile)
        project2.push(f2BFile)

        fileUploader.addFiles(project1, true)
        fileUploader.addFiles(project2, false)

        comparator.buildInstances();
        comparator.buildScore();

        var total: PlagiarismInstance[] = comparator.comparator.getAllPlagiarismInstances();

        //At least one instance of method extraction from this, file1 from student 1 22-25 and file1 from student 2 22-35
        let wantedInstnace: PlagiarismInstance = new PlagiarismInstance(f1AFile.getFileName(),f1BFile.getFileName(),
            22,25,22,35
        )
        
        // But we don't have this instance
        expect(JSON.stringify(total)).not.contain(JSON.stringify(wantedInstnace))

        // Yet, we still can detect direct method copy cases based on count visitor mechanism, one of the instances is this:
        // blockinterset method direct duplicate
        let obtainedInstance: PlagiarismInstance = new PlagiarismInstance(f1AFile.getFileName(),f1BFile.getFileName(),
        36,44,41,49
        )

        // Expect this appear in the report.
        expect(JSON.stringify(total)).contain(JSON.stringify(obtainedInstance))      
        // Test score here 
        let score: number = comparator.getComparator().getScore()
        expect(score).equals(63.93)      
    })

    it("11. Test catching all Literals and BinaryExpressions", () => {

        // clear lingering files
        fileUploader.clear()

        // get test files
        let file1 = 
        fs.readFileSync(path.resolve(__dirname,"../sample/AllTypesFiles/AllTypes1.js"), 'utf-8')
        let evalFile1 = FileFactory('allTypes1.js', file1);
        let file2 = 
        fs.readFileSync(path.resolve(__dirname,"../sample/AllTypesFiles/AllTypes2.js"), 'utf-8')
        let evalFile2 = FileFactory('allTypes2.js', file2);

        // put test files into fileuploader
        fileUploader.addFiles([evalFile1], true);
        fileUploader.addFiles([evalFile2], false);

        // build comparison
        let comparator: ComparatorBuilder = new ComparatorBuilder();
        comparator.buildInstances();
        comparator.buildScore();

        // get results of comparison
        let comparison: IComparator = comparator.getComparator()
        let instances = comparison.getAllPlagiarismInstances();
        let score = comparison.getScore();

        // test returned values
        expect(instances).to.have.same.deep.members([new PlagiarismInstance("allTypes1.js", "allTypes2.js", 
                                                                            1, 26, 1, 26)]);
        expect(score).to.equal(100);

    })

    it('12: Test calculating score when at least one range maps to multiple instances', () => {
      
        // clear lingering files
        fileUploader.clear()

        // get test files
        let file1 = 
        fs.readFileSync(path.resolve(__dirname,"../sample/MultipleRangesFiles/MultipleRanges1.js"), 'utf-8')
        let evalFile1 = FileFactory('allTypes1.js', file1);
        let file2 = 
        fs.readFileSync(path.resolve(__dirname,"../sample/MultipleRangesFiles/MultipleRanges2.js"), 'utf-8')
        let evalFile2 = FileFactory('allTypes2.js', file2);

        // put test files into fileuploader
        fileUploader.addFiles([evalFile1], true);
        fileUploader.addFiles([evalFile2], false);

        // build comparison
        let comparator: ComparatorBuilder = new ComparatorBuilder();
        comparator.buildInstances();
        comparator.buildScore();

                // get results of comparison
        let comparison: IComparator = comparator.getComparator()
        let score = comparison.getScore();

        expect(score).to.equal(72.72)
    })

})