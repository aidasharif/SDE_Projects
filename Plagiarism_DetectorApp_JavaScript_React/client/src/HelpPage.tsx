import React from 'react';
import { Card } from 'antd';
import './ReportTable.css';


export default class ReportTable extends React.Component<any, any> {

    /**
     * Creates a string describing instructions on how to use the Plagiarism Detection app.
     */
    getHelpString() {

        let helpString = "";

        // describes creating new comparison
        helpString += "Creating a New Comparison\n"
        helpString += "*NOTE* :: The selected files must be valid and syntatically correct javascript files!\n"
        helpString += "\t- Click on the 'New Comparison' button on the sidebar\n";
        helpString += "\t- Select the 'Choose Files' buttons for each project and upload the project files\n";
        helpString += "\t- Select the 'Compare Files' button\n";


        helpString += "\n"

        // describes how to evaluate results of comparison
        
        helpString += "Finding Comparison Overview\n";
        helpString += "\t- Upload files to projects 1 and 2 and select compare in File Uploader screen\n"
        helpString += "\t- Wait for the results of the comparison to appear on screen\n"
        helpString += "\t- Select the 'Overview' button in the top left corner to see an overview of the project "
                        + "results\n";
        
        helpString += "\n";

        // describes choosing an instance of plagiarism to evaluate
        helpString += "Choosing an Instance of Plagiarism to Evaluate\n";
        helpString += "\t- Upload files to projects 1 and 2 and select compare in File Uploader screen\n"
        helpString += "\t- Wait for the results of the comparison to appear on screen\n"
        helpString += "\t- Select a File on the left hand side of the screen from either Project 1 or Project 2\n";
        helpString += "\t- Select an instance of Plagiarism from the window under the File Selection on the left side "
                        + "of the screen\n"
        helpString += "\t- Evaluate the instance of plagiarism manually in the Code Windows\n"
        helpString += "\t**NOTE** The selected instance of plagiarism will be higlighted in red\n"

        helpString += "\n";

        // describes how to sign up for a new account
        helpString += "Signing Up for a New Account\n"
        helpString += "\t- Put your email address in the 'Email' box on the left side of the screen\n"
        helpString += "\t- Create a password with at least six characters in the 'Password' box on the left side of "
                        + "the screen\n"
        helpString += "\t- Select the 'Sign In' Button\n"

        helpString += "\n"

        // describes how to log into an existing account
        helpString += "Logging In to an Existing Account\n"
        helpString += "\t- Put your email address in the 'Email' box on the left side of the screen\n"
        helpString += "\t- Create a password with at least six characters in the 'Password' box on the left side of "
                        + "the screen\n"
        helpString += "\t- Select the 'Log In' Button\n"

        helpString += "\n";

        // describes reviewing a saved report
        helpString += "Viewing a Report\n";
        helpString += "*NOTE* :: Only available if you are logged into an account!\n"
        helpString += "\t- Select the 'View Reports' button on the left side of the screen\n";
        helpString += "\t- Select a report from the middle screen\n"
        helpString += "\t- View the contents of the report on the right side of the screen\n"

        helpString += "\n"

        // describes how to log out of an account
        helpString += "Logging Out\n";
        helpString += "*NOTE* :: Only available if you are logged into an account!\n"
        helpString += "\t- Select the 'Log Out' button on the left side of the screen\n"


        return helpString;
    }

    render() {
        return <>
            <Card 
                title="How To Use Plagiarism Detector Beta"
                style={{height: 1000}}
                className='report-card'
            >
                <div>
                <p>{this.getHelpString()}</p>
                </div>
            </Card>
        </>   
    }
}