import FileUploader from './FileUploader';
import { EvalFile, FileFactory } from './EvalFile';
import * as express  from 'express';
import IComparator from './IComparator';
import ComparatorBuilder from './ComparatorBuilder';

/**
 * Console class ports information received from client into information that
 * can be used by components in the back end server.
 * <<Singleton>>
 */
export default class Console {

    private static instance: Console;
    private constructor() {}

    /**
     * Gets an instance of Console.
     */
    public static getInstance() : Console {
        // if instance of console does not yet exist, create Console object
        if (Console.instance == null) {
            Console.instance = new Console();
        }

        //return instances
        return Console.instance;
    }

    // port files from request to FileUploader
    public addFiles(req: express.Request, isProject1: boolean) : void {
        // get singleton instance of file uploader
        let fileUploader = FileUploader.getInstance();
        let fileArray: EvalFile[] = [];

        if (req.files != null) {
            //get keys from uploaded files
            let keys = Object.keys(req.files);
            let length = keys.length;
            // iterate through files uploaded
            for (let i = 0; i < length; i++) {
                // get file using key
                let file = req.files[keys[i]];
                // create evalFile from name and raw data
                let evalFile = FileFactory(file.name, file.data.toString('utf-8'));
                // add eval file to file array
                fileArray.push(evalFile);
            }
        }

        // add parsed files for project to fileUploader
        fileUploader.addFiles(fileArray, isProject1);
    }

    /**
     * Get EvalFiles array containing files for a given project.
     * 
     * @param isProject1 true to get files from project 1, false for project 2
     */
    public getFiles(isProject1: boolean) : EvalFile[] {
        let fileUploader = FileUploader.getInstance();
        // if isProject1 is true, get files from project 1
        if (isProject1) {
            return fileUploader.getProject1();
        } 
        // otherwise get files from project 2
        else {
            return fileUploader.getProject2();
        }
    }

    /**
     * Delete files from a given project
     * 
     * @param req express request containing information about file to be deleted
     * @param isProject1 true to delete from project 1, false for project 2
     */
    public deleteFile(req: express.Request, isProject1: boolean) : void {
        let fileUploader = FileUploader.getInstance();
        // get file to delete from request
        let filetoDelete = req.body.fileName;
        // pass name of file to delete and isProject1 flag to fileUploader for deletion
        fileUploader.delFiles(filetoDelete, isProject1)
    }

    /**
     * Clears all files for both projects from FileUploader.
     */
    public clearFiles() : void {
        let fileUploader = FileUploader.getInstance();
        // clear all files from both projects in FileUploader
        fileUploader.clear();
    }

    /**
     * Compares the projects stored in FileUploader instance and returns
     * results as IComparator.
     */
    public compareProjects() : IComparator {

        //create new builder
        let comparatorBuilder = new ComparatorBuilder();
        // build instances
        comparatorBuilder.buildInstances();
        // build score
        comparatorBuilder.buildScore();
        // return results of comparison
        return comparatorBuilder.getComparator();

    }

}