import React, {Component} from 'react';
import $ from 'jquery';
import './Doctor.css';
import View from './View.js';
const axios = require('axios');
//let patient='NewPro-env.q4mxnbtu3g.us-east-1.elasticbeanstalk.com';
//const url="NewPro-env.q4mxnbtu3g.us-east-1.elasticbeanstalk.com";
const url = "localhost:8001";
//const url ="localhost:"
export class Doctor extends Component {
    constructor(props){
        super(props);
        this.state={
            doctor_id:this.props.id,
            doctor_name:this.props.name,
            patient_id:'',
            patient_email:'dhruvil123@gmail.com',
            view0:false,
            view1:false,
            add: true,
            htm:'',
            report:false,
            patient_data:[],
            load1:false,
            canaccess:false
        }
        this.submit = this.submit.bind(this);
        this.view = this.view.bind(this);
        this.form = this.form.bind(this);
        this.cancelAdd = this.cancelAdd.bind(this);
        this.gotomain = this.gotomain.bind(this);
    }

    async getId(id){
        let data;
        console.log(id);
        await axios.post("http://localhost:8000/patient_id", {'emailId': id})
            .then(jsonResponse=>{
                console.log(jsonResponse);
                data = jsonResponse.data;
            })
            .catch(error=>{
                console.log(error);
            })
        //patient_id = data;
        return data;
    }

    async submit(){
        this.setState({
            load1:true
        })
        let data={};
        const age = document.getElementById('age').value;
        const weight = document.getElementById('weight').value;
        const height = document.getElementById('height').value;
        const disease = document.getElementById('disease').value;
        const severity = document.getElementById('severity').value;
        const medicine = document.getElementById('medicine').value;
        const location = document.getElementById('location').value;
        if(this.state.patient_id){

            const patient_id = this.state.patient_id;
            data['patient_id'] = patient_id;
        }else{

            const patient_id = await this.getId(document.getElementById('patient_id').value);
            data['patient_id'] = patient_id;
        }
        //console.log(e.target.querySelector('input[name="patient_email"]').value);
        console.log(age);
        data['doctor_id'] = this.state.doctor_id;
        data['doctor_name'] = this.state.doctor_name;
        data['age'] = age;
        data['weight'] = weight;
        data['height'] = height;
        data['disease'] = disease;
        data['severity'] = severity;
        data['location'] = location;
        data['medicine'] = medicine;
        console.log(data);
        
        await axios.post("http://localhost:8000/canaccess", {"emailId": this.state.patient_email})
            .then(jsonResponse=>{
                console.log(jsonResponse.data);
                this.setState({
                    canaccess:jsonResponse.data
                })
        })

        if(this.state.canaccess){
            const resp = await fetch("http://"+url+"/new_transaction", {
                method:'POST',
                 headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(jsonResponse=>{
                    return jsonResponse;
                })
                .catch(error=>{
                    console.log(error);
                });
            console.log(resp);
        } else {
            alert("Access Denied!")
        }

        let patient_data=[];//before=>{}
        await axios.post("http://"+url+"/get_patient_data", {"patient_id": this.state.patient_id})
            .then(jsonResponse=>{
                console.log(jsonResponse);
                patient_data = jsonResponse['data']['chain'];
                //document.getElementById('render').innerHTML = htm;
            })
            .catch(error=>{
                console.log(error);
            })
        this.setState({
            add:false,
            load1:false,
            view1:true,
            patient_data: patient_data
        })
    }

    async view(e){
        this.setState({
            load1:true
        })
        const patient_email = document.getElementById('patient_id').value;

        await axios.post("http://localhost:8000/canaccess", {"emailId": patient_email})
            .then(jsonResponse=>{
                console.log(jsonResponse.data);
                this.setState({
                    canaccess:jsonResponse.data
                })
        })

        if(this.state.canaccess){
                        const patient_id = await this.getId(document.getElementById('patient_id').value);
                        let patient_data={};
                        await axios.post("http://"+url+"/get_patient_data", {"patient_id": patient_id})
                            .then(jsonResponse=>{
                                console.log(jsonResponse);
                                patient_data = jsonResponse['data']['chain'];
                                //document.getElementById('render').innerHTML = htm;
                            })
                            .catch(error=>{
                                console.log(error);
                            })
                        this.setState({
                            patient_id:patient_id,
                            patient_email:patient_email,
                            patient_data: patient_data,
                            view0 : false,
                            view1:true,
                            load1:false
                        })
            } else {
                alert("Patient data is not accessible!!")
            }

    }

    cancelAdd(){
        this.setState({
            add:false,
            view1:true      
        })
    }

    fileSelectHandler(e){
        console.log(e.target.files[0]);
    }

    report(){
        this.setState({
            add:false,
            view1:false,
            view0:false,
            report:true
        })
    }

    form(){
        this.setState({
            add:true,
            view1:false,
            view0:false
        })
    }

    gotomain(){
        this.setState({
            add:false,
            view1:false,
            view0:true,
            report:false
        })
    }

  	render(){
        const form = (
                <div className="main">
                    <div>
                        <h3 id="doctor_id" >Dr. Id:{this.state.doctor_id}</h3><br></br>
                        <h3 id="doctor_name">Dr. Name:{this.state.doctor_name}</h3><br></br>
                        <h3 id="patient_id">patient Id:{this.state.patient_id}</h3><br></br>
                        <h3>Patient email:{this.state.patient_email}</h3><br></br>
                        <label>Age:</label>
                        <input type="text" id="age" placeholder="age of the patient"/><br></br>
                        <label>Weight:</label>
                        <input type="text" id="weight" placeholder="weight of the patient"/><br></br>
                        <label>Height:</label>
                        <input type="text" id="height" placeholder="height of the patient"/><br></br>
                        <label>Disease:</label>
                        <input type="text" id="disease" placeholder="disease of the patient"/><br></br>
                        <label>Severity:</label>
                              <select id="severity">
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                              </select><br></br>
                        <label>Locale:</label>
                        <input type="text" id="location" placeholder="locale"/><br></br>
                        <label>Doctor Id:</label>
                        <textarea id="medicine" rows="10" cols="30" placeholder="medicines"></textarea><br></br>
                        <input type="submit" className="sub" onClick={this.submit} value="submit"/><br></br>
                        {this.state.load1?<div className="lds-ellipsis"><div></div><div></div><div></div></div>:''}<br></br>
                        <button className="c" onClick={this.cancelAdd}>Cancel</button>
                    </div>
                </div>
        )

        const report = (
            <div>
                <input type="file" onChange={this.fileSelectHandler}/>
                <button onClick={this.gotomain}>Upload</button>
                <button className="cancelback" onClick={this.gotomain}>Cancel/Back</button>
            </div>
        )

        const view = (
            <div>
            <h1 style={{'marginTop':'100px',color:"#003333",'textAlign':'center'}}>Welcome, Dr. {this.state.doctor_name}</h1>
            <div className="view">
                <input style={{'border':'1px solid lightblue','borderRadius':'30px', width:'400px'}} className="doctorip" type="text" id="patient_id" placeholder="email of the patient"/><br></br>
                <input type="submit" className="doctorbtn" onClick={this.view} value="SUBMIT"/>
            </div>
            {this.state.load1?<div className="lds-ellipsis"><div></div><div></div><div></div></div>:''}
            </div>
        )

        const view1 = (
            <div className="view11">
                <h2 style={{color:"#003300"}}>Patient id:{this.state.patient_id}</h2>
                <div className="view1">
                    {this.state.patient_data.map(d=><View data={d}/>)}
                </div>
                <button className="cancelback" onClick={this.form}>ADD</button>
                <button className="cancelback" onClick={this.report.bind(this)}>ADD Report</button>
                <button className="cancelback" onClick={this.gotomain}>Cancel/Back</button>
            </div>
        )

    	return (
        <div className="doctorhome0">
                <button className="b" onClick={this.props.goback}>Log out!</button>
                <div className="doctorhome1">
                    <div className="doctorhome2">
                    {this.state.view0? view : ''}
                    {this.state.view1? view1 : '' }
                    {this.state.add?form:''}
                    {this.state.report?report:''}
                    </div>
                </div>
        </div>
    	)
  }
}
export default Doctor;