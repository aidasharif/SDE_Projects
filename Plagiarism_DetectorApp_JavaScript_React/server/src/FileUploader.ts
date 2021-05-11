import { EvalFile } from "./EvalFile";

/**
 * FileUploader handles uploading files and getting files for projects for 
 * plagiarism comparison.
 * <<Singleton>>
 */
class FileUploader {

    private static instance: FileUploader;    
    private project1: EvalFile[];
    private project2: EvalFile[];
    private constructor() {
        this.project1 = [];
        this.project2 = [];
    }
    /**
     * Returns a singleton instance of itself.
     */
    public static getInstance() : FileUploader {
        if (!FileUploader.instance) {
            FileUploader.instance = new FileUploader();
        }
        return FileUploader.instance;
    }
    /**
     * Adds files for each project.
     * 
     * @param f files to be uploaded to project.
     * @param isProject1 true to upload project 1 files, false for project 2
     */
    public addFiles(f: EvalFile[], isProject1: boolean) : void {
        // if no files added, throw error
        if (f.length == 0) {
            throw new Error("No files uploaded");
        }
        
        // iterate through files, if not .java file, throw an error 
        // if multiple uploads for same file in same project, throw error
        for (let i = 0; i < f.length; ++i) {
            // if file at i is not javascript file, throw error
            if (!f[i].getFileName().endsWith(".js")) {
                throw new Error("Files must end with .js")
            } 
            // iterate through files, if two files with matching names exist, through error
            else if (f.findIndex((curr) => { return curr.getFileName() === f[i].getFileName() }) != i) {
                throw new Error("Multiple files with the same name cannot be added to same project");
            }
            
        }

        // if flag is true, add to project 1, otherwise add to project 2
        if (isProject1) {
            this.project1 = this.project1.concat(f);
        } else {
            this.project2 = this.project2.concat(f);
        }        
     }

     /**
      * Delete selected files for a project
      * 
      * @param fileName name of the file to be deleted
      * @param isProject1 true to delete from project 1, false to delete from project 2
      */
     public delFiles(fileName: string, isProject1: boolean) : void {

        // record initial lengths
        let len1 = this.project1.length;
        let len2 = this.project2.length;

        // if fileName equals name in FileEval object, return false; otherwise return true
        if (isProject1) {
            // filter out projects that do not have name matching given file
            this.project1 = this.project1.filter((x) => { return x.getFileName() !== fileName; })
        } else {
            // filter out projects that do not have name matching given file
            this.project2 = this.project2.filter((x) => { return x.getFileName() !== fileName; })
        }

        // if init lengths match current lengths, no file /deleted, throw error
        if (this.project1.length == len1 && this.project2.length == len2) {
            throw new Error("File does not exist");
        }
     }

     /**
      * Returns all the files for project 1.
      */
     public getProject1(): EvalFile[] {
         // if no files exist, nothing to retrieve, throw error
        if (this.project1.length == 0) {
            throw Error("No files exist for project 1");
        } else {
            return this.project1;
        }
     }

     /**
      * Returns all the files for project 2.
      */
     public getProject2(): EvalFile[] {
        // if no files exist, nothing to retrieve, throw error
        if (this.project2.length == 0) {
            throw Error("No files exist for project 2");
        } else {
            return this.project2;
        }
    }

    /**
     * Removes files from all projects.
     */
    public clear(): void {
        // set both projects to empty arrays
        this.project1 = [];
        this.project2 = [];
    }
}

export default FileUploader