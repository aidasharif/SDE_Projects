import { Col, Row, Button, Table } from 'antd';
import React from 'react';
import Title from 'antd/lib/typography/Title';
import './Comparison.css';
import scrollIntoView from 'scroll-into-view';
import {db} from './Firebase';

/**
 * contains info about a specific file
 */
interface FileInfo {
    project: string;
    fileName: string;
    code: CodeInfo[];
    instances: InstanceInfo[];
}

/**
 * contains generic info about an instance of plagiarism
 */
interface InstanceInfo {
    fileName1: string;
    lines1: string;
    lines1Start: number,
    lines1End: number,
    fileName2: string;
    lines2: string;
    lines2Start: number,
    lines2End: number,
}

/**
 * contains information about code in a file (line # | {code} )
 */
interface CodeInfo {
    fileName: string,
    code: string;
    line: string;
}

/**
 * contains info about instance of plagiarism to be displayed in Instance table
 * pertains only to corresponding instance of plagiarism in other file
 * file name here is NOT SELECTED FILE - IS CORRESPONDING FILE
 */
interface DisplayInstance {
    fileName: string;
    lines: string;
    originalInstance: InstanceInfo;
}

/**
 * the Comparison class is responsible for showing the results of the comparison
 * results are gathered and parsed in FileUploader after call to server
 */
export default class Comparison extends React.Component<any, any> {

    // column info for tables in comparison view
    instanceColumns!: object[];
    fileColumns!: object[];
    codeColumns!: object[];

    /**
     * Parse the data passed from parent component to build display information for 
     * files that have been compared as well as instance of plagiarism between
     * those files.
     * 
     * @param props values passed from the parent component
     */
    constructor(props: {}) {
        super(props);

        // port all instances into current instance info interface
        let parentInstances = this.props.instances;
        let instances: InstanceInfo[] = [];
        for (let i = 0; i < parentInstances.length; ++i) {
            instances.push({
                fileName1: parentInstances[i].fileName1, 
                lines1:(parentInstances[i].lines1Start.toString() + ' - ' + parentInstances[i].lines1End.toString()),
                fileName2: parentInstances[i].fileName2, 
                lines2:(parentInstances[i].lines2Start.toString() + ' - ' + parentInstances[i].lines2End.toString()),
                lines1Start: parentInstances[i].lines1Start,
                lines1End: parentInstances[i].lines1End,
                lines2Start: parentInstances[i].lines2Start,
                lines2End: parentInstances[i].lines2End
            })
        }

        // find and format all information for project 1 and related files
        let project1Files: FileInfo[] = [];
        let p1Files = this.props.project1Files
        this.populateProjectFiles(project1Files, p1Files, instances, '1');

        // find and format all information for project 2 and related files
        let project2Files: FileInfo[] = [];
        let p2Files = this.props.project2Files
        this.populateProjectFiles(project2Files, p2Files, instances, '2');
        
        // set the state
        this.state = {
            // content is the string representation for the component to be displayed in the main part of the window
            content: 'Overview',
            // window1File is CodeInfo[] displayed in window 1
            window1File: null,
            // window1FileName is the name of the file being displayed in window 1
            window1FileName: null,
            // window2File is CodeInfo[] displayed in window 2
            window2File: null,
            // window2FileName is the name of hte file being displayed in window 2
            window2FileName: null,
            // instanceInfo is the collection of InstanceInfo[] to be used to save reports
            instanceInfo: instances,
            // instances are DisplayInstance[] for instances within the corresponding selected file
            displayInstances: null,
            // instance is the InstanceInfo[] related to the current instance
            instance: null,
            // the number of instances of plagiarism from the comparison
            totalInstances: this.props.instances.length,
            // the percentage of the file that exhibits plagiarism
            score: this.props.score,
            // project1Files are FileInfo[] in project 1
            project1Files: project1Files,
            // project2Files are FileInfo[] in project 2
            project2Files: project2Files,
            // selectedFiles are FileInfo[] for project selected in window
            selectedFiles: project1Files,
            // selectedFile is FileInfo for file being evaluated
            selectedFile: null,
            // the row of the selected file in the file window
            fileRow: -1,
            // the row of the selected instance in the instance window
            instanceRow: -1
        }

        // defines keys and titles for columns to be used in tables
        // files are listed purely by name
        this.fileColumns = [
            {dataIndex:'fileName'}
        ]

        // instances listed by files and relevant lines
        this.instanceColumns = [
            {title: 'Files', dataIndex: 'fileName', width:'55%'},
            {title: 'Lines', dataIndex: 'lines', width:'45%'}
        ];

        // columns listed by line and code at line in file
        this.codeColumns = [
            {dataIndex:'line', width:'5%'},
            {dataIndex:'code', width:'95%'}
        ]
    }

    /**
     * Populates the FileInfo[] project files with filenames, code, and instances.
     * 
     * @param clientProject project to populate
     * @param serverFiles corresponding project files from parent component
     * @param instances instances of plagiarism
     */
    populateProjectFiles(clientProject: FileInfo[], serverFiles: any, instances: InstanceInfo[], 
                        project: string) : void {
        
        for (let i = 0; i < serverFiles.length; ++i) {

            // generate code info for file
            let fileName = serverFiles[i].fileName;
            let code = serverFiles[i].code;
            // split contents by newlines -- creates collection where line# = index + 1
            let lines = code.split('\n');
            let fileCode: CodeInfo[] = [];
            // iterate through lines in code and add to CodeInfo interface
            for (let j = 0; j < lines.length; ++j) {
                // include name of file, line of code, and the line code appears on
                fileCode.push({fileName: fileName, code:lines[j], line:(j+1).toString()})
            }

            let currInstances: InstanceInfo[] = [];
            // generate instance list
            for (let j = 0; j < instances.length; ++j) {
                if (instances[j].fileName1 === fileName || instances[j].fileName2 === fileName) {
                    currInstances.push(instances[j]);
                }
            }

            // add all file info to project file
            if (project === '1') {
                clientProject.push({project: '1', fileName: fileName, code:fileCode, instances:currInstances})
            } else {
                clientProject.push({project: '2', fileName: fileName, code:fileCode, instances:currInstances})
            }
        }
    }

    /** 
     * Finds and sets the files to be displayed in the Files table.
     */
    displayFiles(file: string) : void {
        // set the files to be displayed based on string flag
        // "1" for project 1, "2" for project 2
        let nextFiles = null;
        if (file === "1") {
            nextFiles = this.state.project1Files;
        } else if (file === "2") {
            nextFiles = this.state.project2Files;
        }

        // set info for all subsequent windows to null so that no lingering information
        // is displayed to the user
        this.setState({
            // set the state such that nextFiles are the files corresponding to the
            // selected project
            selectedFiles: nextFiles,
            selectedFile: null,
            instances: null,
            window1File: null,
            window1FileName: null,
            window2File: null,
            window2FileName: null,
            fileRow: -1,
            instanceRow: -1
        });
    }


    /**
     * Finds and sets instances of plagiarism associated with the file selected
     * in the File table.
     * 
     * @param file the file information that holds the display instances
     * @param rowIndex the index of the file that was selected
     */
    displayInstances(file: FileInfo, rowIndex: number) : void {
        // get the instances associated with the given file and set array to collect 
        // relevant instances
        let instances = file.instances;
        let displayInstances: DisplayInstance[] = [];
        let recorded: DisplayInstance[] = [];

        // iterate through all isntances, find all instances associated with the
        // given file and collect the names of the OTHER FILE that has matching instance
        // of plagiarism
        for (let i = 0; i < instances.length; ++i) {
            if (file.fileName === instances[i].fileName1 
                // catch duplicate instance that has a mirror instance from project 1 -> 2
                && !recorded.find(curr => ( curr.fileName === instances[i].fileName2 
                                            && curr.lines === instances[i].lines2))) {

                let displayInstance = {
                    fileName: instances[i].fileName2, 
                    lines: instances[i].lines2, 
                    originalInstance: instances[i]
                }
                displayInstances.push(displayInstance);
                recorded.push(displayInstance);
            } 
            // catch duplicate isntance that has a mirror instance from project 2 -> 1
            else if (!recorded.find(curr => ( curr.fileName === instances[i].fileName1 
                                                && curr.lines === instances[i].lines1))) {
                let displayInstance = {
                    fileName: instances[i].fileName1, 
                    lines: instances[i].lines1, 
                    originalInstance: instances[i]
                }
                displayInstances.push(displayInstance);
                recorded.push(displayInstance);
            }
            
        }

        this.setState({ 
            // set instances to be displayed in instance window
            instances: displayInstances, 
            // set selected file
            selectedFile: file,
            // set window1 and window2 file to null such that any linger information about
            // previous files are hidden
            window1File: null,
            window2File: null,
            // set fileRow to be the given index in order to highlight file that is currently
            // selected
            fileRow: rowIndex,
            // set instanceRow to -1 so that no instance in the Instance table is highlighted
            instanceRow: -1
        })
    }

    /**
     * Display the contents of a file and the filename to a Code Window on the screen.
     * 
     * @param instance the plagiarism instance to be evaluated
     * @param rowIndex the row index of the selected file
     */
    displayFile(instance: DisplayInstance, rowIndex: number) : void {

        // find the code associated with the selected file and the file name of
        // the selected file
        let window1 = this.state.selectedFile.code;
        let window1FileName = this.state.selectedFile.fileName;
        // get the name of the file with the corresponding instance of plagiarism
        let otherFile = instance.fileName;

        // set variables to hold relvant information about corresponding file
        let window2 = null;
        let window2FileName = '';
        
        // find the corresponding file and code for the selected instance of plagiarism
        // to be displayed in Code window 2
        if (this.state.selectedFile.project === '1') {
            for (let i = 0; i < this.state.project2Files.length; ++i) {
                // if project 2 file at i is other file specified in instance
                // get filename and code from instance and break
                if (this.state.project2Files[i].fileName === otherFile) {
                    window2 = this.state.project2Files[i].code;
                    window2FileName = this.state.project2Files[i].fileName;
                    break;
                }
            }
        } else {
            for (let i = 0; i < this.state.project1Files.length; ++i) {
                // if project 1 file at is is other file specified in instance
                // get filename and code from instance and break
                if (this.state.project1Files[i].fileName === otherFile) {
                    window2 = this.state.project1Files[i].code;
                    window2FileName = this.state.project1Files[i].fileName;
                    break;
                }
            }
        }

        // set information to display code and filename for primary file and
        // corresponding file
        // set instance row index to appropriately color selected instnace
        this.setState({
            content: 'Detailed',
            window1File: window1,
            window1FileName: window1FileName,
            window2File: window2,
            window2FileName: window2FileName,
            instance: instance.originalInstance,
            instanceRow: rowIndex
        })
    }

    /**
     * Determine whether or not the current line is part of an instance of plagiarism. 
     * Used to highlight instances of plagiarism.
     * 
     * @param record the code info instance at the given index
     * @param index the line number of the code info instance
     */
    getRowColor(record: CodeInfo, index: number) : boolean {
        // get the instance of plagiarism being displayed
        let instance = this.state.instance;
        // if the given row falls within the instance of plagiarism for the file
        // displayed in the window, return true, otherwise return false
        if (record.fileName === instance.fileName1) {
            return index >= instance.lines1Start - 1 && index <= instance.lines1End - 1;
        } else {
            return index >= instance.lines2Start - 1 && index <= instance.lines2End - 1;
        }
    }

    /**
     * Determine whether or not the given line corresponds to the given index.
     * 
     * @param rowIndex the index of the row being evaluated
     * @param selectedIndex the index of the row that is being looked for
     */
    getEntryColor(rowIndex: number, selectedIndex: number) : boolean {
        return rowIndex === selectedIndex;
    }

    /**
     * Get the FileName for the project displayed in a Code window.
     * 
     * @param isProject1 whether or not the project file being displayed is for the
     *                   file displayed in window 1
     */
    getFileName(isProject1: boolean) : string {
        // if the the file name for a file in the window is not null, return the
        // filename -- otherwise, return generic "file#" to be displayed until a
        // file is chosen
        if (isProject1) {
            if (this.state.window1FileName != null) {
                return this.state.window1FileName;
            } else {
                return "file1";
            }
        } else {
            if (this.state.window2FileName != null) {
                return this.state.window2FileName;
            } else {
                return "file2";
            }
        }
    }

     /**
     * Generates a report for the results of the plagiarism comparison as a string.
     * Formats the data to be stored in Firebase under logged in account.
     */
    generateReport() : Object {

        let reportString: string = ""

        // set percentage
        reportString += "Project files were " + this.state.score + "% similar.\n\n"

        // set number of instances
        reportString += this.state.totalInstances + " instances of plagiarism were detected.\n\n"

        // list files for project 1
        reportString += "Project 1 Files:\n";
        let p1Files = this.state.project1Files;
        for (let i = 0; i < p1Files.length; ++i) {
            reportString += "\t- " + p1Files[i].fileName + "\n";
        }

        reportString += "\n"

        // list files for project 2
        reportString += "Project 2 Files:\n";
        let p2Files = this.state.project2Files;
        for (let i = 0; i < p2Files.length; ++i) {
            reportString += "\t- " + p2Files[i].fileName + "\n";
        }

        reportString += "\n"

        // detail instances
        reportString += "Instances:\n"

        let instances: Array<InstanceInfo> = this.state.instanceInfo;

        // collect instances such that filename and lines of plagiarism are recorded
        for (let i = 0; i < instances.length; ++i) {
            let file1String = instances[i].fileName1 + " lines " + instances[i].lines1;
            let file2String = instances[i].fileName2 + " lines " + instances[i].lines2;
            reportString += "\t- " + file1String + " : " + file2String + "\n";
        }

        // return report string as 'data' in object
        return {
            data: reportString
        }
    }

    /**
     * Saves a report of the results from the plagiarism comparison to the logged 
     * in account in Firebase as a string.
     */
    saveReport(): void {

        let reportData = this.generateReport();
        db.collection('users')
            .doc(this.props.email+this.props.password)
            .collection('reports')
            .doc('report'+this.props.reports)
            .set(reportData)
        const user={
            uid:this.props.email,
            up:this.props.password,
            reports: (this.props.reports+1)
        }
        db.collection('users').doc(user.uid+user.up).set(user)
        this.props.setReportNumber(this.props.reports + 1)
    }

    /**
     * Scroll to the first line in an instance of plagiarism in code window 1 and 2.
     */
    handleScroll = () => {
        // scroll plagiarism instance for window 1 into view
        scrollIntoView(document.querySelector('.row-selected-a') as HTMLElement, {
            align: {
            top: 0,
            },
        });

        // scroll plagiarism instance for window 2 into view
        scrollIntoView(document.querySelector('.row-selected-b') as HTMLElement, {
            align: {
            top: 0,
            },
        });
    }

    /**
     * Calls methods to be performed after a component in Comparison updates.
     */
    componentDidUpdate() {
        this.handleScroll();
    }

        /**
     * Sets the detailed layout for the Comparison page with code windows and
     * specific instances of plagiarism.
     */
    handleDetailed() {
        this.setState({
            content: 'Detailed'
        })
    }

    /**
     * Sets the overview layout for the Comparison page with the overall results
     * of the plagiarism comparison.
     */
    handleOverview() {
        this.setState({
            content: 'Overview',
            selectedFile: null,
            instances: null,
            window1File: null,
            window1FileName: null,
            window2File: null,
            window2FileName: null,
            fileRow: -1,
            instanceRow: -1
        })
    }

    /**
     * Displays the content in the middle-left side of the screen (code window or plagiarism
     * overview).
     */
    displayMainContent() {
        let content = this.state.content;
        switch(content) {
            // if Overview, create Overview object
            case 'Overview':
                return this.displayOverview();
            // if Detailed, created object with code from files in code windows
            case 'Detailed':
                return this.displayCodeWindows();
        }
    }

    /**
     * Displays code in windows to view instances of plagiarism.
     */
    displayCodeWindows() : JSX.Element {
        return <>
            <Col span={9} style={{ paddingRight: '1%' }} className='col-style'>
                <>
                    {/* Code window 1 - show selected file */}
                    <Title style={{ fontSize: 25, marginBottom: 0, paddingLeft: 15, border: '2px solid black' }}>
                        {this.getFileName(true)}
                    </Title>
                    <Table<CodeInfo>
                        showHeader={false}
                        columns={this.codeColumns}
                        dataSource={this.state.window1File}
                        pagination={false}
                        scroll={{ y: 100, x: 100 }}
                        bordered={false}
                        style={{ width: '100%', height: 728, background: 'white', border: '2px solid black' }}
                        className='code-table'
                        rowClassName={(record, index) => (
                            this.getRowColor(record, index) ? "row-selected-a" : "row-unselected"
                        )}
                    >
                        <Table.Column<CodeInfo> key='line' title='code' />
                    </Table>
                </>
            </Col>
            <Col span={9} className='col-style'>
                <>
                    {/* code window 2 - shows corresponding file with plagiarism */}
                    <Title style={{ fontSize: 25, marginBottom: 0, paddingLeft: 15, border: '2px solid black' }}>
                        {this.getFileName(false)}
                    </Title>
                    <Table<CodeInfo>
                        showHeader={false}
                        columns={this.codeColumns}
                        dataSource={this.state.window2File}
                        pagination={false}
                        scroll={{ y: 100, x: 100 }}
                        bordered={false}
                        style={{ width: '100%', height: 728, background: 'white', border: '2px solid black' }}
                        className='code-table'
                        rowClassName={(record, index) => (
                            this.getRowColor(record, index) ? "row-selected-b" : "row-unselected"
                        )}
                    >
                        <Table.Column<CodeInfo> key='line' title='code' />
                    </Table>
                </>
            </Col></>
    }

    /**
     * Displays an overview of results for the plagiarism comparison.
     */
    displayOverview() : JSX.Element {
        return <>
        <Col span={10} style={{margin:200}}>
            <Row style={{width:650, paddingTop:150, height:200, textAlign:'center', backgroundColor:'#d41b2e'}}>
                    <Title style={{color:'white', width:'inherit'}}>{this.state.score}% Similar</Title>
            </Row>
            <Row style={{width:650, height:200, textAlign:'center', backgroundColor:'#d41b2e'}}>
                <Title style={{color:'white', width:'inherit'}}>
                    {this.state.totalInstances} Instances of Plagiarism Detected
                </Title>
            </Row>
        </Col>
        </>
    }

    /**
     * Formats the "Save" button displayed on screen. If a user is logged in, is
     * interactable. Otherwise, the button is disabled.
     */
    getSaveButton() {
        if (this.props.loggedin) {
            return <Button
                style={{fontSize:12}} 
                onClick={this.saveReport.bind(this)} className='detail-button'
            >
                Save
            </Button>
        } else{
            return <Button
                style={{fontSize:12}} 
                disabled={true} className='detail-button'
            >
                Save
            </Button>
        }
    }
    
    render() {
        return <><Row style={{paddingTop:25, paddingRight:10, width:'inherit', overflow:'clip'}}>
            <Col span={5} style={{padding:10 , paddingTop:0}} className='col-style'>
                <Row 
                    align='middle' 
                    justify='center' 
                    style={{width:'inherit', height:50, background:"white", border:"2px solid black"}}>
                    <Button 
                        style={{fontSize: 12}} 
                        className='detail-button' onClick={this.handleOverview.bind(this)}
                    >
                            Overview
                    </Button>
                    <Button
                        style={{fontSize: 12}} 
                        className='detail-button' onClick={this.handleDetailed.bind(this)}
                    >
                        Detailed
                    </Button>
                    {this.getSaveButton()}
                </Row>
                <Row 
                    justify='start' 
                    align='middle' 
                    style={{
                        marginTop:5, width:'inherit', 
                        height:33, 
                        background:"white", 
                        border:"2px solid black",
                        textOverflow:'ellipsis',
                        overflow:'hidden'    
                    }}
                >
                    <Title style={{paddingLeft:10, fontSize:20}}>Project Files</Title>
                </Row>
                <Row 
                    justify='start' 
                    style={{width:'inherit', 
                        height:40, 
                        background:"white", 
                        border:"2px solid black",
                        borderTop: 0,
                        borderBottom: 0,
                        borderSpacing:0
                    }}
                >
                    <Button 
                        style={{height:'100%', width:'33%', textOverflow:'ellipsis', overflow:'hidden'}}
                        onClick={() => this.displayFiles('1')}
                    >
                        Project 1
                    </Button>
                    <Button 
                        style={{height:'100%', width:'33%', textOverflow:'ellipsis', overflow:'hidden'}}
                        onClick={() => this.displayFiles('2')}
                    >
                        Project 2
                    </Button>
                </Row>
                <Row
                    style={{height:291}}
                >
                    <Table<FileInfo>
                        showHeader={false}
                        columns={this.fileColumns}
                        dataSource={this.state.selectedFiles}
                        pagination={false}
                        scroll={{y:200}}
                        bordered={true}
                        style={{width:'100%', height:'100%', background:'white', border:'2px solid black'}}
                        onRow={(record, rowIndex) => { return {
                            onClick: (event: any) => {
                                // bind the call to instance here
                                if(typeof rowIndex === 'number') {
                                    this.displayInstances(record, rowIndex);
                                }
                            }};
                        }}
                        className='file-table'
                        rowClassName={(record, index) => ( 
                            this.getEntryColor(index, this.state.fileRow) ? "entry-selected" : "entry-unselected" 
                        )}
                        >
                            <Table.Column<FileInfo> key='fileName' title='lines'/>
                    </Table>
                </Row>
                <Row 
                    justify='start' 
                    align='middle' 
                    style={{marginTop:5, width:'inherit', height:30, background:"white", border:"2px solid black"}}>
                    <Title style={{paddingLeft: 10, fontSize:20}}>Instances</Title>
                </Row>
                <Row style={{marginTop:0, height:309}}>
                    <>
                    <Table<DisplayInstance>
                        columns={this.instanceColumns}
                        dataSource={this.state.instances}
                        pagination={false}
                        scroll={{y:200}}
                        bordered={true}
                        style={{width:'100%', height:'100%', background:'white', border:'2px solid black'}}
                        onRow={(record, rowIndex) => { return {
                            onClick: (event: any) => {
                                // bind the call to instance here
                                if(typeof rowIndex === 'number') {
                                    this.displayFile(record, rowIndex);
                                }
                            }};
                        }}
                        className='instance-table'
                        rowClassName={(record, index) => ( 
                            this.getEntryColor(index, this.state.instanceRow) ? "entry-selected" : "entry-unselected" 
                        )}
                        >
                            <Table.Column<DisplayInstance> key='fileName' title='lines'/>
                    </Table>
                    </>
                </Row>
            </Col>
            {this.displayMainContent()}
        </Row>
        </>
    }

}