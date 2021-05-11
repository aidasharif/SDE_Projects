import { Input, Layout, Image, Row, Button } from 'antd';
import React from 'react';
import northeastern_logo from './northeastern_logo.png'
import line from './line.png'
import Title from 'antd/lib/typography/Title';
import fire from './Firebase';
import { db } from './Firebase';

const { Sider } = Layout

/**
 * Displays and contains information pertaining to the user as well as buttons and
 * options for user navigation on left side of window.
 */
export default class SideBar extends React.Component<any, any> {

    /**
     * Creates and instance of Sidebar where initial user is set to empty
     * 
     * @param props values passed from parent component.
     */
    constructor(props: {} | Readonly<{}>){
        super(props)
        this.state={
            // whether or not there is an error
            hasError: false,
            // error message
            message:'',
        }
    }

    /**
     * Called when there is a change in the authentication state
     */
    authListener() : void {
        //The onAuthStateChanged method gets invoked in the UI thread on changes in the authentication state:
        //-Right after the listener has been registered
        //-When a user is signed in
        //-When the current user is signed out
        //-When the current user changes
        fire.auth().onAuthStateChanged((user) =>{
            //if the user is signed it the loggedin state is true
            if(user){
                this.props.setLoggedInStatus(true);
            }
            //otherwise it's false
            else{
                this.props.setLoggedInStatus(false);
            }
        })
    }

    /**
     * The login allows existing users to sign in using their email address and password. 
     * When a user completes the react form, we call login to use the signInWithEmailAndPassword method
     * 
     * @param event react state
     */
    login(event:any) : void {
        //By calling event.preventDefault() we indicate that we want to prevent the default behavior (the login),
        // since this code is handling that itself (by calling .signInWithEmailAndPassword).
        event.preventDefault();
        try{
            fire.auth().signInWithEmailAndPassword(this.props.email,this.props.password).then((u)=>
            {
                //whenever a user logs in we grab the database info (number of reports) from
                //fire store and update the info by calling initializeTable to show the previous reports
                this.props.setLoggedInStatus(true);
                // access collection of users
                db.collection('users')
                // access user signed into app
                .doc(this.props.email+this.props.password)
                // get number of reports for user
                .get().then(snapshot =>(this.props.setReportNumber(snapshot.get('reports'))));

            }).catch((err)=>{
                // set error message sent from server
                this.setState({message:err.message})}
            )}
        catch(err){
            //if for any reasons it can't sign in we get catch the error
            this.setState({
                hasError: true,
                message: "Login failed"
            })
        }  
    }

    /**
     * Sign up form  allows new users to register with our app using their email address and a password. 
     * When a user completes the react app sign up form, it passes the user name and password to 
     * the createUserWithEmailAndPassword method
     * 
     * @param event react state
     */
    signup(event:any) : void {
        //By calling event.preventDefault() we indicate that we want to prevent the default behavior (the sign up),
        // since this code is handling that itself (by calling .createUserWithEmailAndPassword).
        event.preventDefault();
        fire.auth().createUserWithEmailAndPassword(this.props.email,this.props.password).then((u)=>
        {
            //when a new user signs up we assign a new props for it, setting the number of reports to 0
            const user={
                uid:this.props.email,
                up:this.props.password,
                reports: 0
            }
            //in the database of firestore we make a new document for the reports for this user
            //the key to the document is the combination of user id and password
            db.collection('users').doc(user.uid+user.up).set(user)

        }).then(() =>{
            //when a new user signs up we automatically sign them in and set their reports to 0
            this.props.setLoggedInStatus(true);
            this.props.setReportNumber(0);
        }).catch((err)=>{
            this.setState({message:err.message})
        })
    }

    /**
     * If there is an error logging in or signing up, display error on screen.
     */
    displayError() : JSX.Element {
        // if error is not null, dispaly error
        if (this.state.hasError != null) {
            return <Title style={{fontSize:14, color:'#d41b2e'}}>
                {this.state.message}
            </Title>
        } else {
            return <Title></Title>
        }
    }

    /**
     * Log out of the user account.
     */
    logout = () => {
        // log out of firebase
        fire.auth().signOut();
        // reset user values in app
        this.props.logout();

        // set hasError and error message on logout
        this.setState({
            hasError: false,
            message: ""
        })

    }

    /**
     * Returns sider content for user if logged in, otherwise displays generic
     * content with ability to login and sign up for service.
     * 
     * @param hasUser whether or not there is a user logged in
     * @param username name of user logged into app
     */
    getSiderContent(hasUser: boolean, username: string) : JSX.Element {
        if (hasUser) {
            return this.hasUserContent(username);
        } else {
            return this.noUserContent();
        }
    }

    /**
     * Removes the domain name from the user's email.
     * 
     * @param email 
     */
    clipUserName(email: string) : string {
        return email.split('@')[0];
    }

    /**
     * Displays sider content when there is a user logged into the app
     * 
     * @param email email of user logged into app
     */
    hasUserContent(email: string) : JSX.Element {
        return <>
            <Title style={{
                    color:'white', 
                    width:200, 
                    height:30, 
                    paddingTop:30, 
                    fontSize: 16, 
                    wordWrap:'break-word'
                }}
            >
                {this.clipUserName(email)}
            </Title>
            <Row justify='center' style={{height:80}}>
                <Button 
                    style={{ width: 180, color: 'white', background: '#d41b2e', borderColor: 'black' }}
                    onClick={this.logout.bind(this)}
                >
                    Log Out
                </Button>
                <Button 
                    style={{ width: 180, color: 'white', background: '#d41b2e', borderColor: 'black' }}
                    onClick={this.props.getReportTableLayout}
                >
                    View Reports
                </Button>
            </Row>
        </>
    }

    /**
     * Displays sider content when there is no user logged into the account
     */
    noUserContent() : JSX.Element {

        return <>
        <Row justify='center' gutter={16}>
            <Input
                placeholder='Email'
                style={{height:35, width: 200, marginTop: 10 }} 
                onChange={(event) => { this.props.updateEmail(event.target.value) }}
            />
            <Input
                placeholder='Password'
                type='password'
                style={{ width: 200, height:35 }} 
                onChange={(event) => { this.props.updatePassword(event.target.value) }}
            />
        </Row>
        <Row justify='center' gutter={16} style={{marginTop:10}}>
            <Row justify='center' style={{ width:250 }}>
                <Button
                    style={{ width: 180, color: 'white', background: '#d41b2e', borderColor: 'black' }}
                    onClick={this.login.bind(this)}
                >
                    Log In
                </Button>
            </Row>
            <Row>
                <Button 
                    style={{ width: 180, color: 'white', background: '#d41b2e', borderColor: 'black' }}
                    onClick={this.signup.bind(this)}
                >
                    Sign Up
                </Button>
            </Row>
        </Row>
            <Row style={{height:20, width:180, wordWrap:'break-word'}}>
                {this.displayError()}
            </Row>
            </>
        
    }

    render() {
        return <Sider width={250}
            style={{height:'inherit', textAlign:'center', background:'#444444'}}
            >
            <Image
                src={northeastern_logo}
                preview={false}
                width={200}
                style={{marginTop:30}}
            />
            <Title style={{color:'white', fontSize:25, marginTop:20, font:''}}>
                Plagiarism Detector Beta
            </Title>
            <Image 
                src={line}
                width={200}
                preview={false}
            />
            <Row justify='center' style={{ height:225 }}>
            { this.getSiderContent(this.props.loggedin, this.props.email) }
            </Row>
            <Image 
                src={line}
                width={200}
                preview={false}
                style={{marginTop:5}}
            />
            <Button 
                style={{marginTop:10, width:180, color:'white', background:'#d41b2e', borderColor:'black'}} 
                onClick={this.props.getFileUploadLayout}
            >
                New Comparison
            </Button>
            <Button 
                style={{marginTop:10, width:180, color:'white', background:'#d41b2e', borderColor:'black'}} 
                onClick={this.props.getHelpLayout}
            >
                Help
            </Button>
        </Sider>

    }
}