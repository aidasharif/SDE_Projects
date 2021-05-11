import { expect } from 'chai';
import { describe } from 'mocha';
import { EvalFile, FileFactory } from '../src/EvalFile'

describe("Test FileFactory and EvalFile", () => {

    it("1. Test FileFactory", () => {
        // use file factory to create a valid object
        let evalFile: EvalFile = FileFactory("Example.js", "//data");

        // check contents of eval file using getters
        expect(evalFile.getFileName()).to.equal("Example.js");
        expect(evalFile.getContents()).to.equal("//data");
    })

    it("2. Test passing empty fileName to FileFactory", () =>{
        expect(() => { FileFactory("", "data") }).to.throw(Error, "Filename and Contents cannot be empty");
    })

    it("3. Test passing empty contents to FileFactory", () =>{
        expect(() => { FileFactory("file", "") }).to.throw(Error, "Filename and Contents cannot be empty");
    })
})