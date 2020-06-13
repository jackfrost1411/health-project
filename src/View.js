import React, {Component} from 'react';
import './View.css';
//const axios = require('axios');
import $ from 'jquery';
import {findDOMNode} from 'react-dom';
export class View extends Component {
    constructor(props){
        super(props);
        this.state = {
                patient_data:this.props.data,
                timestamp:this.props.data['time_stamp'],
                patient_id: this.props.data['transactions']['patient_id'],
                doctor_id: this.props.data['transactions']['doctor_id'],
                doctor_name: this.props.data['transactions']['doctor_name'],
                age: this.props.data['transactions']['age'],
                weight: this.props.data['transactions']['weight'],
                height: this.props.data['transactions']['height'],
                disease: this.props.data['transactions']['disease'],
                severity: this.props.data['transactions']['severity'],
                location: this.props.data['transactions']['location'],
                medicine: this.props.data['transactions']['medicine']
        }
    }

    toggle2(){
        const el = findDOMNode(this.refs.details2);
        $(el).toggle();
    }

    render_data(){
            console.log(this.state.patient_data)
    }

  	render() {

    	return (
            <div>
                <div className="details" onClick={this.toggle2.bind(this)}><h3>Date:{this.state.timestamp.split(" ")[0]}</h3>
                <h3>Disease: {this.state.disease}</h3></div>
                <div className="details2" ref="details2" >
                <div className="details3">
                    <div>Checked up by..
                        <h3>Doctor Id:{this.state.doctor_id}</h3>
                        <h3>Doctor Name:{this.state.doctor_name}</h3>
                    </div><br></br>
                    <div>Patient Details..
                    <h3>Age: {this.state.age}</h3><h3>Weight: {this.state.weight}</h3>
                    <h3>Height: {this.state.height}</h3>
                    <h3>Severity of the disease: {this.state.severity}</h3>
                    <h3>Residential location of the patient: {this.state.location}</h3>
                    <h3>Prescribed medicines: {this.state.medicine}</h3></div>
                </div>
                </div>
            </div>
        )
    	
    }
}
export default View;