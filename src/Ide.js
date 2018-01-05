import React, { Component } from 'react';
import {
    TextField, RaisedButton, AppBar, MuiThemeProvider, Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui';
import axios from 'axios';
import { downloadAsFile, csvDownload } from './download'
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/sql/sql';
import 'codemirror/theme/material.css';
import { RadioButton } from 'material-ui/RadioButton';
import { getTableData } from './jsondata';
import { FilePicker } from 'react-file-picker';
require('codemirror/mode/javascript/javascript');

const buttonStyle = {
    margin: '0.5em',
};

class Ide extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    handleCodeUpdate = (editor, data, code) => {
        this.setState({
            code
        })
    }
    _fetchjsonData(tableData){
        console.log(tableData);
        axios.get('https://rjxdzgc652.execute-api.ap-south-1.amazonaws.com/api/execute/')
         .then( (response) => {
             console.log(response.data);
             
             this.setState({
                 tableHeader: response.data.headers,
                 tableData: response.data.data
             })
        })
        .catch( (error) => {
            console.log(error);
        })
    }
    // _fetchjsonData(tableData) {
    //     getTableData(tableData)
    //         .then(data => {
    //             this.setState({
    //                 tableHeader: data.headers,
    //                 tableData: data.data
    //             })
    //         })
    // }
    handleClickSubmit = (event) => {
        event.preventDefault();
        this._fetchjsonData(this.state);
    }
    handleClickClear = (event) => {
        event.preventDefault();
        this.setState({
            code: '',
        });
    }
    handleClickClearTable = (event) => {
        event.preventDefault();
        this.setState({
            tableHeader: [],
            tableData: []
        })
    }
    handleDownloadCodeAsFile = () => {
        downloadAsFile(this.state.code, 'text/x-sql', 'script.sql');
    }
    handleResultsDownload = () => {
        csvDownload(this.state.tableHeader, this.state.tableData, 'output.csv');
    }
    loadFile = (file) => {
        const reader = new FileReader();
        reader.onload = () => {
            this.setState({
                code: reader.result
            });
        }
        reader.readAsText(file);
    };
    handleFileLoad = () => {
        this.input.type = '';
        this.input.type = 'file';
        const changeListener = () => {
            if (this.input.files.length) {
                this.loadFile(this.input.files[0]);
            }
            this.input.removeEventListener('change', changeListener);
        }
        this.input.addEventListener('change', changeListener);
        this.input.click();
    }
    render() {
        const { tableHeader = [], tableData = [], code = '' } = this.state;

        const options = {
            lineNumbers: true,
            mode: 'text/x-hive',
            theme: 'material',
        };
        // const headerComponents = this.generateHeaders();
        // const rowComponents = this.generateRows();
        return (
            <MuiThemeProvider>
                <div>
                    <AppBar
                        title="SQL Console"
                    />
                    <div>
                        <CodeMirror value={code} onBeforeChange={this.handleCodeUpdate} options={options} />
                    </div>
                    <div>
                        <input style={{ display: 'none' }} type="file" ref={ref => { this.input = ref; }} />
                        <RaisedButton label="Submit" primary={true} style={buttonStyle}
                            onClick={this.handleClickSubmit} />
                        <RaisedButton label="Clear" primary={true} style={buttonStyle}
                            onClick={this.handleClickClear} />
                        <RaisedButton label="Load" primary={true} style={buttonStyle}
                            onClick={this.handleFileLoad} />
                        <RaisedButton label="Save" primary={true} style={buttonStyle}
                            onClick={this.handleDownloadCodeAsFile} />
                    </div>
                    {tableHeader.length > 0 && (
                        <div>
                            <Table>
                                <TableHeader>
                                    <TableRow >
                                        {tableHeader.map((row, index) => (
                                            <TableRowColumn key={index}><b>{row}</b></TableRowColumn>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tableData.map((row, index) => (
                                        <TableRow key={index}>
                                            {row.map((value, i) => (
                                                <TableRowColumn key={i}>{value}</TableRowColumn>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div>
                                <RaisedButton label="Clear" primary={true} style={buttonStyle}
                                    onClick={this.handleClickClearTable} />
                                <RaisedButton label="Save" primary={true} style={buttonStyle}
                                    onClick={this.handleResultsDownload} />
                            </div>
                        </div>)}
                </div>
            </MuiThemeProvider>
        );
    }
}
export default Ide;