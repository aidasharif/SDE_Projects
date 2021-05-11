import { expect } from 'chai';
import { describe } from 'mocha';

import { EvalFile, FileFactory } from '../src/EvalFile';
import FileUploader from '../src/FileUploader';

// generic file instances to be used as stand-ins for all tests
const FILEA = FileFactory('example1.js', 'console.log("hello world1");');
const FILEB = FileFactory('example2.js', 'console.log("hello world2");');
const FILEC = FileFactory('example3.js', 'console.log("hello world3");');
const FILED = FileFactory('example4.js', 'console.log("hello world4");');
const FILEE = FileFactory('example5.py', 'print("Hello world")');
const FILEF = FileFactory('example6.py', 'print("Hello world")');


describe("FileUploader tests", () => {

    it("1. Test adding files to project 1", () => {
        let uploader = FileUploader.getInstance();

        // clear lingering files in fileuploader
        uploader.clear();

        // add files to project 1
        uploader.addFiles([FILEA, FILEC], true);

        // get files from project 1
        let p1 = uploader.getProject1();

        // expect returned collection to have entries with same data as what was passed to fileuploader
        expect(p1).to.have.same.deep.members([
            new EvalFile('example1.js', 'console.log("hello world1");'),
            new EvalFile('example3.js', 'console.log("hello world3");')
        ])

    })

    it("2. Test adding files to project 2", () => {
        let uploader = FileUploader.getInstance();

        // clear lingering files in fileuploader
        uploader.clear();

        // add files to project 2
        uploader.addFiles([FILEB, FILED], false);

        // get files from project 2
        let p2 = uploader.getProject2();

        // expect returned collection to have entires with same data as what was passed to fileuploader
        expect(p2).to.have.same.deep.members([
            new EvalFile('example2.js', 'console.log("hello world2");'),
            new EvalFile('example4.js', 'console.log("hello world4");')
        ])

    })

    it("3. Testing persistent Singleton implementation", () => {
        // create initial instance of fileuploader
        let uploader = FileUploader.getInstance();

        // clear lingering files in fileuploader
        uploader.clear();

        // add files to project 1 and 2
        uploader.addFiles([FILEA, FILEC], true);
        uploader.addFiles([FILEB, FILED], false);

        // get files in projects 1 and 2
        let p1 = uploader.getProject1();
        let p2 = uploader.getProject2();

        // expect returned collections to have same members as what was passed to each project
        expect(p1).to.have.same.deep.members([
            new EvalFile('example1.js', 'console.log("hello world1");'),
            new EvalFile('example3.js', 'console.log("hello world3");')
        ])

        expect(p2).to.have.same.deep.members([
            new EvalFile('example2.js', 'console.log("hello world2");'),
            new EvalFile('example4.js', 'console.log("hello world4");')
        ])

        // re-get instance, ensure it has same members
        let uploaderN = FileUploader.getInstance();

        // re-get files in projects 1 and 2
        let p1N = uploaderN.getProject1();
        let p2N = uploaderN.getProject2();

        // expect returned collections to have same members as what was initially passed to each project
        expect(p1N).to.have.same.deep.members([
            new EvalFile('example1.js', 'console.log("hello world1");'),
            new EvalFile('example3.js', 'console.log("hello world3");')
        ])

        expect(p2N).to.have.same.deep.members([
            new EvalFile('example2.js', 'console.log("hello world2");'),
            new EvalFile('example4.js', 'console.log("hello world4");')
        ])

    })

    it("4. Test adding non-Javascript files to project 1", () => {
        
        let fileUploader = FileUploader.getInstance();

        expect(() => { fileUploader.addFiles([FILEE], true); }).to.throw(Error, "Files must end with .js");
    })

    it("5. Test adding non-Javascript files to project 2", () => {
        
        let fileUploader = FileUploader.getInstance();

        expect(() => { fileUploader.addFiles([FILEF], false); }).to.throw(Error, "Files must end with .js");
    })

    it("6. Test adding multiple files with same name to project 1", () => {
        let uploader = FileUploader.getInstance();

        expect(() => { uploader.addFiles([FILEA, FILEA], true) }).to.throw(Error,
            "Multiple files with the same name cannot be added to same project");

    })

    it("7. Test adding multiple files with same name to project 2", () => {
        let uploader = FileUploader.getInstance();

        expect(() => { uploader.addFiles([FILEB, FILEB], false) }).to.throw(Error,
            "Multiple files with the same name cannot be added to same project");

    })

    it("8. Test deleting files from project 1", () => {
                
        let uploader = FileUploader.getInstance();

        // clear any lingering files in file uploader
        uploader.clear();

        // add files to project 1
        uploader.addFiles([FILEA, FILEC], true);

        // get files stored in project 1
        let p1 = uploader.getProject1();

        // expect returned collection to have same members as what was passed to file uploader
        expect(p1).to.have.same.deep.members([
            new EvalFile('example1.js', 'console.log("hello world1");'),
            new EvalFile('example3.js', 'console.log("hello world3");')
        ])

        // delete an existing file from project 1 by file name
        uploader.delFiles('example1.js', true);

        // re-get project 1 files from file uploader
        let p1N = uploader.getProject1();

        // expect collection not to have removed member but still have other non-deleted members
        expect(p1N).to.have.same.deep.members([
            new EvalFile('example3.js', 'console.log("hello world3");')
        ])

    })

    it("9. Test deleting files from project 2", () => {
                
        let uploader = FileUploader.getInstance();

        // clear any lingering files in file uploader
        uploader.clear();

        // add files to project 2
        uploader.addFiles([FILEB, FILED], false);

        // get files for project 2
        let p2 = uploader.getProject2();


        // expect returned files to have same members as what was uploaded to project 2
        expect(p2).to.have.same.deep.members([
            new EvalFile('example2.js', 'console.log("hello world2");'),
            new EvalFile('example4.js', 'console.log("hello world4");')
        ])

        // delete a file by filename from proejct 2
        uploader.delFiles('example2.js', false);

        // re-get files from file uploader
        let p2N = uploader.getProject2();

        // expect deleted object to no longer be in collection and that other files are still in collection
        expect(p2N).to.have.same.deep.members([
            new EvalFile('example4.js', 'console.log("hello world4");')
        ])
    })

    it("10. Test deleting non-existent files from project 1", () => {
        let uploader = FileUploader.getInstance();

        uploader.clear();

        // add files to project 1
        uploader.addFiles([FILEA, FILEC], true);

        // attempt to delete file that does not exist in project 1
        expect(() => { uploader.delFiles('example5', true) }).to.throw(Error, 'File does not exist');
    })

    it("11. Test deleting non-existent files from project 2", () => {
        let uploader = FileUploader.getInstance();

        uploader.clear();

        // add files to project 2
        uploader.addFiles([FILEB, FILED], false);

        // attempt to delete file that does not exist in project 2
        expect(() => { uploader.delFiles('example6', false) }).to.throw(Error, 'File does not exist');
    })

    it("12. Test adding empty files to project 1", () => {

        let uploader = FileUploader.getInstance();

        expect(() => { uploader.addFiles([], true) }).to.throw(Error, "No files uploaded");
    })

    it("13. Test adding empty files to project 2", () => {

        let uploader = FileUploader.getInstance();

        expect(() => { uploader.addFiles([], false) }).to.throw(Error, "No files uploaded");
    })

    it("14. Test getting files from project 1 when no files exist", () => {

        let uploader = FileUploader.getInstance();

        // remove any lingering files from file uploader
        uploader.clear();

        expect(() => { uploader.getProject1(); }).to.throw(Error, "No files exist for project 1");
    })

    it("15. Test getting files from project 2 when no files exist", () => {

        let uploader = FileUploader.getInstance();

        // remove any lingering files from file uploader
        uploader.clear();

        expect(() => { uploader.getProject2(); }).to.throw(Error, "No files exist for project 2");
    })

    it("16. Test clearing files from all projects", () => {
        let uploader = FileUploader.getInstance();
        
        // remove linger files in fileuploader
        uploader.clear();

        // add files to projects 1 and 2
        uploader.addFiles([FILEA, FILEC], true);
        uploader.addFiles([FILEB, FILED], false);

        // get uploaded files for projects 1 and 2
        let p1 = uploader.getProject1();
        let p2 = uploader.getProject2();

        // expect size of returned collectiosn to match number of files added to uploader
        expect(p1.length).to.equal(2);
        expect(p2.length).to.equal(2);

        // clear added files
        uploader.clear();

        // expect error indicating neither project has any files to return
        expect(() => { uploader.getProject1(); }).to.throw(Error, "No files exist for project 1");
        expect(() => { uploader.getProject2(); }).to.throw(Error, "No files exist for project 2");

    })

})
