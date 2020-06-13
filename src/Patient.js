import React, {Component} from 'react';
import View from './View.js';
import './Patient.css';
const axios = require('axios');
//const url="NewPro-env.q4mxnbtu3g.us-east-1.elasticbeanstalk.com";
const url="localhost:8001";
export class Patient extends Component {
    constructor(props){
        super(props);
        this.state={
            patient_email:this.props.email,
            patient_id:this.props.id,
            patient_name:this.props.name,
            patient_data:[]
        }
        this.pview = this.pview.bind(this);
        this.allow = this.allow.bind(this);
        this.disallow = this.disallow.bind(this);
    }

    async pview(e){
        let patient_data=[];
        await axios.post("http://"+url+"/get_patient_data", {"patient_id": this.state.patient_id})
            .then(jsonResponse=>{
                console.log(jsonResponse);
                patient_data = jsonResponse['data']['chain'];
            })
            .catch(error=>{
                console.log(error);
            })
        this.setState({
            patient_data: patient_data
        });
        console.log(this.state.patient_data);
    }

    async allow(){
        await axios.post("http://localhost:8000/allow", {"emailId": this.state.patient_email})
            .then(jsonResponse=>{
                console.log(jsonResponse);
            })
            .catch(error=>{
                console.log(error);
            })
    }

    async disallow(){
        await axios.post("http://localhost:8000/disallow", {"emailId": this.state.patient_email})
            .then(jsonResponse=>{
                console.log(jsonResponse);
            })
            .catch(error=>{
                console.log(error);
            })
    }

    async componentWillMount(){
        console.log(this.state.patient_email);
        await this.pview();
    }

  	render(){
    	return (
            <div className="patienthome">
            <div className="view11">
                <h1 className="h1">Hello, {this.state.patient_name}</h1>
                <button className="allow" onClick={this.allow}>Allow Access</button>
                <button className="disallow" onClick={this.disallow}>Revoke Access</button>
                <h5 className="h1" style={{color:"#003300"}}>Patient id:{this.state.patient_id}</h5>
                <div className="view1">
                    {this.state.patient_data.map(d=><View data={d}/>)}
                </div>
                <button className="cancelback" onClick={this.props.goback}>Log out!</button>
            </div>
            </div>
    	)
    }
}
export default Patient;