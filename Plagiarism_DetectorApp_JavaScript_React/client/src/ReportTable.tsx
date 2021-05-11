import React from 'react';
import { Card, Col, Row, Table } from 'antd';
import {db} from './Firebase';
import './ReportTable.css';

/**
 * The ReportTable class displays information regarding saved reports for a logged in user as well as
 * the contents of a selected report.
 */
export default class ReportTable extends React.Component<any, any> {

    constructor(props: {}) {
        super(props);

        // access users in database
        db.collection('users')
        // access user currently logged in
        .doc(this.props.email+this.props.password)
        .get()
        // access saved reports
        .then(snapshot =>(this.initializeTable(snapshot.data())))

        this.state = {
            // name of selected report - Default: 'No Report Selected'
            reportName: "No report selected",
            reportContents: "",
        }
    }

    /*
    Ports the data stored on the firebase server into a text file to be displayed
    on the screen.
    */

    /**
     * Ports the data stored on the firebase server into a text file to be displayed
     * on the screen.
     * 
     * @param record the report key in firebase
     * @param rowIndex row where the report was displayed
     */
    openReport(record:any, rowIndex:any) : void {
        // access user info in database
        db.collection('users').doc(this.props.email+this.props.password)
        // access reports for user
        .collection('reports')
        // get the specified report
        .doc('report'+record.key.toString())
        // access the data inside the report
        .get().then(snapshot => (this.setReportData(rowIndex, JSON.stringify(snapshot.data()))))
        // if error, set report data to reflect error state
        .catch(err => {
            this.setState({
            reportName: "Error",
            reportContents: "Could not open report"
        })
        });
    }

    /**
     * Gets the report as a json string and sets it to the report content.
     * 
     * @param reportIndex index of the report in the table
     * @param jsonString info from report
     */
    setReportData(reportIndex: number, jsonString: string) : void {
        // parse json-ified data
        let data = JSON.parse(jsonString);

        // set data to be displayed on screen
        let title = `Report ${reportIndex}`
        let contents = data.data;

        // set state to given report info
        this.setState({
            reportName: title,
            reportContents: contents,
        })
    }

    /**
     *  Get the report info from the Firestore and formats it to be displayed in the table
     *  on screen.
     * 
     * @param snapshot user data
     */
    initializeTable(snapshot:any) : void {
        // set column data to format table
        let columns = [
            {
              title: 'Report',
              dataIndex: 'title',
            }
        ]

        //for the number of reports i we make rows
        let data=[]
        for (let i = 0; i < snapshot.reports; i++) {
            data.push({
            key: i,
            title: `Report ${i + 1}`
            });
        }

        // setting state to enable report opening by clicking on it 
        this.setState({
            columns: columns,
            data: data,
            reports: snapshot.reports
        })
    }

    render() {
        return <>
        <Row>
        <Col style={{margin: 50,marginRight:20}} span={10}>
            <Table
            pagination={false}
            scroll={{y:600}}
            className='report-table'
            columns={this.state.columns} 
            dataSource={this.state.data} 
            bordered 
            onRow={(record:any, rowIndex:any) => { return {
                onClick: (event: any) => {
                    // bind the call to instance here
                    if(typeof rowIndex === 'number') {
                        this.openReport(record, rowIndex);
                    }
                }};
            }}  
            />
        </Col >
            <Col style={{margin: 50,marginLeft:20}} span={11}>
                <Card 
                    title={this.state.reportName} 
                    style={{height: 780}}
                    className='report-card'
                >
                    <p>{this.state.reportContents}</p>
                </Card>
            </Col>
        </Row>
        </>   
    }
}