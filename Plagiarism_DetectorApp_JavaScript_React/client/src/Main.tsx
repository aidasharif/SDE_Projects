import { Layout } from 'antd';
import React from 'react';
import SideBar from './SideBar';
import FileUploader from './FileUploader';
import Comparison from './Comparison'
import ReportTable from './ReportTable';
import HelpPage from './HelpPage';
import Title from 'antd/lib/typography/Title';

/**
 * Describes the primary component for the program -- handles updating components 
 * on the screen as well as passing information between components.
 */
export default class Main extends React.Component<{}, any> {

    /**
     * Creates component with state values necessary to pass information between
     * child components.
     * 
     * @param props values passed from parent component
     */
    constructor(props: {}) {
        super(props);
        this.state = {
            // states whether user is logged in
            loggedin: false,
            // users email
            email: "",
            // users password
            password: "",
            // number of reports in user account
            reports: 0,
            // files for project 1
            project1Files: null,
            // files for project 2
            project2Files: null,
            // instances of plagiarism
            instances: null,
            // plagiarism score
            score: null,
            // layout component for main content - Default is FileUploader
            layout: "FileUploader"
        }
    }

    /**
     * Sets whether or not there is a user logged in.
     * 
     * @param status boolean indicating true for user, false for no user
     */
    setLoggedInStatus(status: boolean) : void {
        this.setState({
            loggedin: status
        })
    }

    /**
     * Updates the user email.
     * 
     * @param email user email
     */
    updateEmail(email: string) : void {
        this.setState({
            email: email
        })
    }

    /**
     * Updates the user password
     * 
     * @param password user password
     */
    updatePassword(password: string) : void {
        this.setState({
            password: password
        })
    }

    setReportNumber(reportNum: number) : void {
        this.setState({
            reports: reportNum
        })
    }

    /**
     * Resets state after user logs out.
     */
    logout() : void {
        this.setState({
            loggedin: false,
            email: "",
            password: "",
            reports: 0,
            layout: "FileUploader"
        })
    }



    /**
     * Sets project files and instnaces of plagiarism from FileUploader to be passed
     * to Comparison child component.
     * 
     * @param project1Files files for project 1
     * @param project2Files files for project 2
     * @param instances instances of plagiarism between project files
     */
    setProjectFiles(project1Files: object[], project2Files: object[], instances: object[], score: number) : void {
        this.setState({
            project1Files: project1Files,
            project2Files: project2Files,
            instances: instances,
            score: score
        });
    }

    /**
     * Switches primary content to Comparison child component to display results of
     * evaluation.
     */
    setComparisonLayout() : void {
        this.setState({ layout: "Comparison"});
    }

    /**
     * Switches primary content to FileUploader child component to allow user to
     * upload files for projects 1 and 2.
     */
    setFileUploadLayout() : void {
        this.setState({ layout: "FileUploader"});
    }

    /**
     * Switches primary content to Report table child component. Allows user to view
     * reports associated with account.
     */
    setReportTableLayout() : void {
        this.setState({ layout: "Reports" })
    }

    /**
     * Switches primary content to Help page to give user instructios on how to use
     * app.
     */
    setHelpLayout() : void {
        this.setState({ layout: "Help" })
    }

    /**
     * Sets the layout for primary content on the screen.
     * 
     * @param layout string tag indicating layout to be displayed
     */
    getCurrentLayout(layout: string) : JSX.Element {
        switch (layout) {
            // if FileUploader, bind methods for switching to comparison layout as well
            // as adding files to state of current Main component
            case "FileUploader":
                return <FileUploader 
                    displayComparison={this.setComparisonLayout.bind(this)}
                    setProjectFiles={this.setProjectFiles.bind(this)} 
                />;
            // if Comparison, pass information in project1Files and project2Files and instances
            // to be displayed in Comparison component
            case "Comparison":
                return <Comparison 
                    email={this.state.email}
                    password={this.state.password}
                    reports={this.state.reports}
                    loggedin={this.state.loggedin}
                    project1Files={this.state.project1Files}
                    project2Files={this.state.project2Files}
                    instances={this.state.instances}
                    score={this.state.score}
                    setReportNumber={this.setReportNumber.bind(this)}
                />;
            // if Reports, create ReportTable component and pass user data needed to retreive
            // reports
            case "Reports":
                return <ReportTable
                    email={this.state.email}
                    password={this.state.password}
                    columns={this.state.columns}
                    data={this.state.data}
                />;
            // if Help, create HelpPage component
            case "Help":
                return <HelpPage/>
            // otherwise, return error message indicating no layout selected
            default:
                return <><Title 
                    style={{color:'#d41b2e', textAlign:'center'}}
                >
                    APPLICATION ERROR: NO LAYOUT SELECTED
                </Title></>
        }
    }

    render() {
        return <Layout style={{marginLeft:50, maxWidth:1700, minWidth:1500, maxHeight:900, minHeight:900}}>
                <SideBar
                    loggedin={this.state.loggedin}
                    email={this.state.email}
                    password={this.state.password}
                    updateEmail={this.updateEmail.bind(this)}
                    updatePassword={this.updatePassword.bind(this)} 
                    getFileUploadLayout={this.setFileUploadLayout.bind(this)}
                    getReportTableLayout={this.setReportTableLayout.bind(this)}
                    getHelpLayout={this.setHelpLayout.bind(this)}
                    setLoggedInStatus={this.setLoggedInStatus.bind(this)}
                    logout={this.logout.bind(this)}
                    setReportNumber={this.setReportNumber.bind(this)}
                />
                <Layout >
                    { this.getCurrentLayout(this.state.layout) }
                </Layout>
        </Layout>
    }
}