import axios from 'axios';
import { Input, Form, Layout, Row, Col, Button, Card, List } from 'antd';
import React from 'react';
import Title from 'antd/lib/typography/Title';
import { CloseOutlined } from '@ant-design/icons';
import './FileUploader.css';

const { Content } = Layout

/**
 * Contains the name of the file and the built-in javascript file type.
 */
interface ProjectFile {
    project: string,
    title: string;
    file: any;
}

/**
 * Contains information about a file returned from the server.
 */
interface EvalFile {
    fileName: string;
    code: string;
}

/**
 * Contains information about instances of plagiarism returned from the server.
 */
interface Instance {
    fileName1: string,
    lines1Start: number,
    lines1End: number,
    fileName2: string,
    lines2Start: number,
    lines2End: number,
}

/**
 * Describes the File Upload page where a user can enter files to be compared.
 */
export default class FileUploader extends React.Component<any, any> {

    /**
     * Creates an instance of the FileUploader component. Clears any existing project
     * files from corresponding server.
     * 
     * @param props values passed down from parent component
     */
    constructor(props: {}) {
        super(props);
        this.state ={
            // collection of ProjectFile[] for project 1
            project1Files: [],
            // collection of ProjectFile[] for project 2
            project2Files: [],
            // waiting for server response
            loading: false,
            // error from status (if there is one)
            errorStatus: null
        }

        // clear all existing files in corresponding server-- creates clean slate
        // for project
        this.deleteServerFiles();
    }

    /**
     * Handles adding files for project 1 to the current instance of File Uploader.
     * 
     * @param event contains information about environment at time of function call.
     */
    onFileChangeProject1 = (event: any) => {
        // get files uploaded into input=file
        let files = event.target.files;
        // create array to store files
        let pFiles: ProjectFile[] = [];
        for (let i = 0; i < files.length; ++i) {
            // use information from file in array of files to create Project File
            // object
            let curr: ProjectFile = {project: '1', title: files[i].name, file: files[i]}
            // add project file to pFiles array
            pFiles.push(curr);
        }
        
        // add all instances of project files to File Upload component state
        this.setState({ 
            project1Files: this.state.project1Files.concat(pFiles),
        })
    }

    /**
     * Handles adding files for project 2 to the current instance of File Uploader.
     * 
     * @param event contains information about environment at time of function call.
     */
    onFileChangeProject2 = (event: any) => {
        // get files uploaded to input=file
        let files = event.target.files;
        // create array to store ProjectFiles
        let pFiles: ProjectFile[] = [];
        for (let i = 0; i < files.length; ++i) {
            // use information from file in array to creat Project File
            let curr = {project: '2', title: files[i].name, file: files[i]}
            // add Project File object to array
            pFiles.push(curr);
        }

        // add all instance of project files to File Uppload component state
        this.setState({ 
            project2Files: this.state.project2Files.concat(pFiles),
        })
    }

    /**
     * Remove a Project File from project 1.
     * 
     * @param item file to be removed from project 1
     */
    deleteProjectFile(item: ProjectFile, project: string) : void {
        // if the file belongs to project 1, filter out of project 1
        if (project === '1') {
            this.setState({
                project1Files: this.state.project1Files.filter((i: { title: string; }) => i.title !== item.title)
            })
        } 
        // else, filter the file out of project 2
        else {
            this.setState({
                project2Files: this.state.project2Files.filter((i: { title: string; }) => i.title !== item.title)
            })
        }
    }

    /**
     * Render information about a Project File to the project 1 card on screen.
     * 
     * @param item Project File object to be rendered.
     */
    renderProjectItem(item: ProjectFile) : JSX.Element {
        // render the item for the given list
        return <List.Item 
            // pass the project in the file to deleteProjectFile
            actions={[<Button onClick={this.deleteProjectFile.bind(this, item, item.project)} 
            icon={<CloseOutlined />} 
        />]}>
            {item.title}
        </List.Item>
    }

    /**
     * Creates a FormData object that formats files to be sent to server via axios.
     * 
     * @param projectFiles project files to be collected and formatted
     */
    populateFormData(projectFiles: ProjectFile[]) : FormData {
        // Create a form data object to hold files in project 1
        let formData = new FormData(); 

        // add all files for project 1 to instance of form data
        for (let i = 0; i < projectFiles.length; ++i) {
            // format file for transmission
            formData.append( 
                "file" + i, 
                projectFiles[i].file
            ); 
        }

        return formData;
    }

    /**
     * Creates an EvalFile array from file array returned from the server.
     * 
     * @param evalFiles files returned from server
     */
    populateProjectFiles(evalFiles: any) : EvalFile[] {
        // create array to store formatted files
        let projectFiles: EvalFile[] = [];
        // iterate through files returned from server
        for (let key in evalFiles) {
            // append project files from server to eval file array
            projectFiles.push({ 
                fileName: evalFiles[key].fileName,
                code: evalFiles[key].contents
            })
        }

        return projectFiles;
    }

    /**
     * Sends information regarding uploaded files for projects 1 and 2 to the server
     * and evaluates responses from the server. Takes information from the server, parses
     * data, and formats data for display.
     */
    async compareProject() : Promise<void> {
        // set loading state to be true while upload and comparison is being done
        this.setState({loading:true});     

        const formData1 = this.populateFormData(this.state.project1Files);
        const formData2 = this.populateFormData(this.state.project2Files);
    
        // send files for project 1 and 2 and wait for response from the server
        let data1 = await this.sendProject('project1', formData1);
        let data2 = await this.sendProject('project2', formData2);
        // if invalid project files for project 1, update loading and inform
        // component of error status -- return and wait for user to correct
        // files based on error message
        if (!this.evaluateSendResponse(data1) || !this.evaluateSendResponse(data2)) {
            return;
        }

        //upon good response for both project1 and project2 uploads, get files from
        // server for projects 1 and 2
        let project1EvalFiles = await this.getProjectFiles('project1');
        let project2EvalFiles = await this.getProjectFiles('project2');

        // parse data returned from the server and create Eval Files to store information
        // about project 1
        let project1Files = this.populateProjectFiles(project1EvalFiles);
        // parse data returned from the server and create Eval Files to store information
        // about project 2
        let project2Files = this.populateProjectFiles(project2EvalFiles);

        // Results of comparison - JSON object corresponds to ProjectComparator in server
        let comparison = await this.getComparison();

        // if the comparison is an error, delete files from server, set state
        if (comparison === 'Comparison Error') {
            this.deleteServerFiles();

            // set loading to false, set error message to be displayed on screen
            this.setState({
                loading: false,
                errorStatus: 'Error comparing files - Check Javascript Syntax in Files'
            });
            // return out of function to terminate execution
            return;
        }

        // iterate through instances of plagiarism from server
        let serverInstances = comparison.plagiarismCaseArray;

        // create array of instances to hold formatted plagiarism instances
        let instances: Instance[] = [];
        for(let key in serverInstances) {
            // format data in instance from server
            // append to instances
            instances.push({
                fileName1: serverInstances[key].filename1,
                fileName2: serverInstances[key].filename2,
                lines1Start: parseInt(serverInstances[key].file1StartLine),
                lines1End: parseInt(serverInstances[key].file1EndLine),
                lines2Start: parseInt(serverInstances[key].file2StartLine),
                lines2End: parseInt(serverInstances[key].file2EndLine)
            })
        }

        // get score from comparison results
        let score = comparison.plagiarismScore;

        // set error status to null and loading state to false
        this.setState({
            loading:false,
            errorStatus: null
        });   

        // set project files and instances of plagiarism in parent component to
        // be passed to Comparison component
        this.props.setProjectFiles(project1Files, project2Files, instances, score)

        // inform parent component that Comparison results are ready to be
        // displayed
        this.props.displayComparison();
    }

    /**
     * Deletes files for project on server.
     */
    deleteServerFiles() : void {
        axios.delete('http://localhost:3001/file/all').catch((error) => {
            this.errorCatcher(error);
        });
    }

    /**
     * Send project files to the server.
     * 
     * @param projectURI the uri of the project where files should be uploaded
     * @param formData files and filenames of project being uploaded
     */
    async sendProject(projectURI: string, formData: FormData): Promise<any> {
        // create uri string corresponding to host
        let uri = 'http://localhost:3001/file/' + projectURI;
        // put files in appropriate resource at server
        return axios.put(uri, formData).then((res) => {
            // return successful response
            return res.data;
        }).catch((error) => {
            return this.errorCatcher(error)
        });
    }

    /**
     * Evaluate the response sent from the server for errors. Return true for good response, false for bad 
     * response.
     * 
     * @param data response from server
     */
    evaluateSendResponse(data: any) : boolean {
        // if the returned response does not indicate good file upload, 
        // set state to false, remove all uploaded files at server
        if (data !== "Files uploaded successfully") {
            this.setState({
                loading:false,
                errorStatus: data
            });
            axios.delete('http://localhost:3001/file/all');
            return false; 
        } else {
            return true;
        }
    }

    /**
     * Request instances of plagiarism between two projects from the server.
     */
    async getComparison() : Promise<any> {
        return axios.get('http://localhost:3001/comparison/').then((res) => {
            return res.data;
        }).catch((error) => {
            return this.errorCatcher(error, 'Comparison Error');
        })
    }

    /**
     * Get project files from a given resource for a project.
     * 
     * @param projectURI project whose files should be get-ed
     */
    async getProjectFiles(projectURI: string) : Promise<any> {
        // create uri string for appropriate project resource
        let uri = 'http://localhost:3001/file/' + projectURI;
        // get files from server
        return axios.get(uri).then((res) => {
            return res.data;
        }).catch((error) => {
            this.errorCatcher(error);
        })
    }

    /**
     * Handles errors returned by axios calls. Handles network connection errors.
     * 
     * @param error the error to be checked
     * @param returnString the string to be returned if error is not a network connection error
     */
    errorCatcher(error: any, returnString?: string) : string {
        // if the error is a network connection error, return message indicating server error
        if (error.toString() === 'Error: Network Error') {
            this.setState({ loading: false, errorStatus: "Server cannot be reached" })
            return "Server cannot be reached";
        } 
        // else return information about error during file upload for project
        else {
            // if return string is not defined, return response in error
            if (returnString === undefined) {
                return error.response.data;
            } else {
                // otherwise, return specified return string
                return returnString;
            }
        }
    }

    /**
     * Display error returned from server when attempting to upload files
     * for either project.
     */
    displayFileUploadError() : any {
        if (this.state.errorStatus != null) {
            return <Title style={{fontSize:14, color:'#d41b2e'}}>
                {this.state.errorStatus}
            </Title>
        }
    }

    render() {
        return <Content>
        <Title style={{ textAlign:'center', marginTop:100}}>
            Select Files To Begin
        </Title>
        <Title style={{ textAlign:'center', margin:0, padding:0, fontSize:14}}>
            (Files must be Javascript - .js)
        </Title>
        <Row justify='center' style={{marginTop:20 , height:500, padding:50, paddingBottom:25}}>
            <Col span={8} style={{ marginRight: 50 }}>
                <Card title='Project 1' className='file-card' >
                    <List 
                        dataSource={this.state.project1Files}
                        renderItem={ 
                            this.renderProjectItem.bind(this)
                        }
                        className='file-list'
                    />
                </Card>
                <Form.Item className='button-row' >
                    <Input 
                        type="file" 
                        multiple 
                        onChange={this.onFileChangeProject1.bind(this)} >
                    </Input>
                </Form.Item> 
            </Col>
            <Col span={8} style={{ marginLeft:50 }}>
                <Card title='Project 2' className='file-card'>
                    <List 
                        dataSource={this.state.project2Files}
                        renderItem={ 
                            this.renderProjectItem.bind(this)
                        }
                        className='file-list'
                    />
                </Card>
                <Form.Item className='button-row' >
                    <Input 
                        type="file" 
                        multiple 
                        onChange={this.onFileChangeProject2.bind(this)} 
                    />
                </Form.Item> 
            </Col>
        </Row>
        <Row justify='center'>
            <Button 
                style={{ width:200, color: 'white', background: '#d41b2e', borderColor: 'black' }}
                onClick={this.compareProject.bind(this)}
                loading={this.state.loading}
            >
                Compare Files
            </Button>
        </Row>
        <Row justify='center' style={{margin:15}}>
            {this.displayFileUploadError()}
        </Row>
    </Content>
    }
}

