/**
 * Represents values used to identify an instance of plagiarism
 * in a program file.
 */
export class PlagiarismInstance {
    filename1: string;
    filename2: string;
    file1StartLine: number;
    file1EndLine: number;
    file2StartLine: number;
    file2EndLine: number;

    /**
     * Creates an instance of PlagiarismInstance between two files and the lines over which
     * the instance of plagiarism occurs.
     * 
     * @param filename1 name of first file
     * @param filename2 name of corresponding file 
     * @param file1StartLine line where plagiarism starts in first file
     * @param file1EndLine line where plagiarism ends in first file
     * @param file2StartLine line where plagiarism starts in the corresponding file
     * @param file2EndLine line where plagiarism ends in the corresponding file
     */
    constructor(filename1: string, filename2: string, file1StartLine: number, 
            file1EndLine: number, file2StartLine: number, file2EndLine: number) {
        
        this.filename1 = filename1;
        this.filename2 = filename2;
        this.file1StartLine = file1StartLine;
        this.file1EndLine = file1EndLine;
        this.file2StartLine = file2StartLine
        this.file2EndLine = file2EndLine;
    }
}

/**
 * Creates an instance of PlagiarismInstance.
 * 
 * @param filename1 name of first file
 * @param filename2 name of corresponding file 
 * @param file1StartLine line where plagiarism starts in first file
 * @param file1EndLine line where plagiarism ends in first file
 * @param file2StartLine line where plagiarism starts in the corresponding file
 * @param file2EndLine line where plagiarism ends in the corresponding file
 */
export function PlagiarismInstanceFactory(  filename1: string, filename2: string, file1StartLine: number, 
                                            file1EndLine: number, file2StartLine: number, file2EndLine: number) {
    // if filenames are empty, throw an error
    if (filename1 == "" || filename2 == "") {
        throw new Error("Filenames cannot be empty");
    }
    // if either end line in file 1 or 2 is less than start line, throw an error
    else if (file1EndLine < file1StartLine || file2EndLine < file2StartLine) {
        throw new Error("End line cannot be before start line")
    }
    // if any line has a value less than 0, throw an error -- line numbers cannot be negative
    else if (file1StartLine < 0 || file2StartLine < 0) {
        throw new Error("Line numbers cannot be negative")
    }
                                                
    return new PlagiarismInstance(  filename1, filename2, file1StartLine, file1EndLine, file2StartLine, file2EndLine);
}