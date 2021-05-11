import { PlagiarismInstance } from './PlagiarismInstance';
import IComparator from './IComparator';

/**
 * Represents the results of a plagiarism comparison between two projects. Provides
 * isntances of plagiarism in project files as well as a quantitative value that 
 * represents the level of plagiarism between two projects.
 */
export default class ProjectComparator implements IComparator {

    plagiarismCaseArray: PlagiarismInstance[];
    plagiarismScore: number;

    /**
     * Return all stored instances of plagiarism found in comparison.
     */
    getAllPlagiarismInstances(): PlagiarismInstance[] {
        return this.plagiarismCaseArray;
    }

    /**
     * Return quantitative score representing level of plagiarismfrom comparison.
     */
    getScore(): number {
        return this.plagiarismScore;
    }

    /**
     * Sets instances of plagiarism found in project comparison.
     * 
     * @param plagiarismInstances found instances of plagiarism
     */
    setPlagiarismInstances(plagiarismInstances: PlagiarismInstance[]): void {
        this.plagiarismCaseArray = plagiarismInstances;
    }

    /**
     * Sets quantatitive score representing level of plagiarism from comparison.
     * 
     * @param score 
     */
    setScore(score: number): void {
        this.plagiarismScore = score;
    }
    
}