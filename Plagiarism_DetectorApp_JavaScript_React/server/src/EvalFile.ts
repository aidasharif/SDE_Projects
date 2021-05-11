
/**
 * Contains information from file uploaded by user.
 */
export class EvalFile {

    /**
     * Creates an instance of File Eval with file's name and contents of the file.
     * 
     * @param fileName name of the file
     * @param contents contents of the file
     */
    constructor(private fileName: string, private contents: string) {}

    /**
     * Gets the filename for the file.
     */
    public getFileName() : string {
        return this.fileName;
    }

    /**
     * Get the contents of the file.
     */
    public getContents() : string {
        return this.contents;
    }

}

/**
 * Creates an EvalFile.
 * 
 * @param fileName name of the file 
 * @param contents contents of the file
 */
export function FileFactory(fileName: string, contents: string) : EvalFile {
    // the filename and contents cannot be empty
    if (fileName == "" || contents == "") {
        throw new Error("Filename and Contents cannot be empty")
    }
    // create new EvalFile object
    return new EvalFile(fileName, contents);
}
