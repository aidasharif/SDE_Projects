import { expect } from 'chai';
import { describe } from 'mocha';
import Console from '../src/Console';
import FileUploader from '../src/FileUploader';
import { EvalFile, FileFactory } from '../src/EvalFile';
import * as fs from 'fs';
import IComparator from '../src/IComparator';
const path = require('path')

describe("Tests for Console", () => {

    it("1.Test Singleton implementation of Console", () => {
        // get 2 instances
        let c1 = Console.getInstance();

        let c2 = Console.getInstance();

        // ensure they are the same instance
        expect(c1).equal(c2)
    })

    it("2.Test getting files for project 1", () => {
        let fileUploader = FileUploader.getInstance();
        // clear any potential existing files in fileuploader
        fileUploader.clear();

        // add files to uploader
        fileUploader.addFiles([FileFactory("file1.js", "data1"), FileFactory("file2.js", "data2")], true);

        // get console
        let console = Console.getInstance();

        // get files from fileuploader for project 1 through console
        let p1Files = console.getFiles(true);

        // check that returned files match what was placed into fileuploader
        expect(p1Files).to.have.same.deep.members([
            new EvalFile('file1.js', 'data1'),
            new EvalFile('file2.js', 'data2')
        ])
    })

    it("3.Test getting files for project 2", () => {
        let fileUploader = FileUploader.getInstance();
        // clear any potential existing files in fileuploader
        fileUploader.clear();

        // add files to uploader
        fileUploader.addFiles([FileFactory("file3.js", "data3"), FileFactory("file4.js", "data4")], false);

        // get console
        let console = Console.getInstance();

        // get files from fileuploader for project 2 through console
        let p2Files = console.getFiles(false);

        // check that returned files match what was placed into fileuploader
        expect(p2Files).to.have.same.deep.members([
            new EvalFile('file3.js', 'data3'),
            new EvalFile('file4.js', 'data4')
        ])
    })

    it("4.Test getting empty files for project 1", () => {
        let fileUploader = FileUploader.getInstance();

        // clear any lingering files in fileuploader
        fileUploader.clear();

        // add files to project 1 in fileuploader
        fileUploader.addFiles([FileFactory("file1.js", "data1"), FileFactory("file2.js", "data2")], true);

        // get console
        let console = Console.getInstance();

        // get project 1 files and ensure that some collection with at least 1 entry is returned
        let p1Files = console.getFiles(true);
        expect(p1Files.length).to.be.greaterThan(0);

        // re-clear files in fileuploader
        fileUploader.clear();

        // check to make sure getting files from project 1 throws an error corresponding to empty project
        expect(() => { console.getFiles(true); }).to.throw(Error, "No files exist for project 1");
    })


    it("5.Test getting empty files for project 2", () => {
        let fileUploader = FileUploader.getInstance();
        // clear any lingering files in fileuploader
        fileUploader.clear();

        // add files to project 2 in fileuploader
        fileUploader.addFiles([FileFactory("file3.js", "data3"), FileFactory("file4.js", "data4")], false);

        // get console
        let console = Console.getInstance();

        // ensure that getting files for project 2 returns collection with at least 1 file entry
        let p2Files = console.getFiles(false);
        expect(p2Files.length).to.be.greaterThan(0);

        // re-clear files in file uploader
        fileUploader.clear();

        // check to make sure getting filesfrom project 2 throws an error corresponding to empty project
        expect(() => { console.getFiles(false); }).to.throw(Error, "No files exist for project 2");
    })

    it("6.Test clearing files", () => {
        let fileUploader = FileUploader.getInstance();
        // clear any lingering files in fileuploader
        fileUploader.clear();

        // add files to projects 1 and 2
        fileUploader.addFiles([FileFactory("file1.js", "data1"), FileFactory("file2.js", "data2")], true);
        fileUploader.addFiles([FileFactory("file3.js", "data3"), FileFactory("file4.js", "data4")], false);

        // get the console
        let console = Console.getInstance();

        // get files for projects 1 and 2 through console
        let p1Files = console.getFiles(true);
        let p2Files = console.getFiles(false);

        // ensure there are at least 1 file entry in collections for project 1 and 2
        expect(p1Files.length).to.be.greaterThan(0);
        expect(p2Files.length).to.be.greaterThan(0);

        //clear files via console
        console.clearFiles();

        // ensure that getting filles from projects 1 and 2 throw errors corresponding to empty project
        expect(() => { console.getFiles(true); }).to.throw(Error, "No files exist for project 1");
        expect(() => { console.getFiles(false); }).to.throw(Error, "No files exist for project 2");
    })

    it("7.Testing compareProject() here. A simple test to see if it works. " + 
        " For a more comprehensive test, please refer to comparatorbuilder.spec.ts", () => {
            let c1 = Console.getInstance();
            let fileUploader = FileUploader.getInstance()
            // Use the test case from ComparatorBuilder.spec.ts
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

            let c =  c1.compareProjects().getAllPlagiarismInstances();
            expect(c.length).equal(5);
            
    })
})