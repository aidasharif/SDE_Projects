import { PlagiarismInstance } from './PlagiarismInstance';

/**
 * Contains methods that must be implemented in order to produce a comparison object
 * representing the results of a plagiarism comparison evaluation.
 */
export default interface IComparator {

    /**
     * Gets all instances of plagiarism from a comparison.
     */
    getAllPlagiarismInstances() : PlagiarismInstance[];

    /**
     * Gets a quantitative value representing level of plagiarism from a comparison.
     */
    getScore() : number;

    /**
     * Sets instances of plagiarism found during comparison.
     * 
     * @param plagiarismInstances instances of plagiarism
     */
    setPlagiarismInstances(plagiarismInstances: PlagiarismInstance[]): void;

    /**
     * Sets a quantitative score represneting level of plagiarism in a comparison.
     * 
     * @param score 
     */
    setScore(score: number): void;

}