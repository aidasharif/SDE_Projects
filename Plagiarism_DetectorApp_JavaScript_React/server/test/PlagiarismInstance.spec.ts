import { expect } from 'chai';
import { describe } from 'mocha';

import { PlagiarismInstance, PlagiarismInstanceFactory } from '../src/PlagiarismInstance'

describe("PlagiarismInstance and Factory Tests", () => {

    it("1. Test creating a PlagiarsimInstance", () => {
        // create an instance of PlagiarismInstance using factory
        let instance = PlagiarismInstanceFactory("file1", "file2", 0, 5, 10, 20);

        // ensure values passed to factory match what is in the PlagiarismInstance object
        expect(instance.filename1).to.equal("file1");
        expect(instance.filename2).to.equal("file2")
        expect(instance.file1StartLine).to.equal(0);
        expect(instance.file1EndLine).to.equal(5);
        expect(instance.file2StartLine).to.equal(10);
        expect(instance.file2EndLine).to.equal(20);
    })

    it("2. Test passing empty filename to file1", () => {
        expect(() => {
            PlagiarismInstanceFactory("", "file2", 0, 5, 10, 20);
        }).to.throw(Error, "Filenames cannot be empty")
    })

    it("3. Test passing empty filename to file2", () => {
        expect(() => {
            PlagiarismInstanceFactory("file1", "", 0, 5, 10, 20);
        }).to.throw(Error, "Filenames cannot be empty")
    })

    it ("4. Test passing file1EndLine line number less than file1StartLine", () => {
        expect(() => {
            PlagiarismInstanceFactory("file1", "file2", 5, 0, 10, 20);
        }).to.throw(Error, "End line cannot be before start line")
    })

    it ("5. Test passing file2EndLine line number less than file2StartLine", () => {
        expect(() => {
            PlagiarismInstanceFactory("file1", "file2", 0, 5, 20, 10);
        }).to.throw(Error, "End line cannot be before start line")
    })

    it("6. Test passing negative file1StartLine to factory", () => {
        expect(() => {
            PlagiarismInstanceFactory("file1", "file2", -1, 5, 10, 20);
        }).to.throw(Error, "Line numbers cannot be negative")
    })
    
    it("7. Test passing negative file2StartLine to factory", () => {
        expect(() => {
            PlagiarismInstanceFactory("file1", "file2", 0, 5, -1, 20);
        }).to.throw(Error, "Line numbers cannot be negative")
    })

})