import React, {Component} from 'react';
import Patient from './Patient.js';
import Doctor from './Doctor.js';
import './Login.css';
const d = require("./d.png");
const p = require("./p.png");
const p2 = require("./patientlogin.jpg");
const d2 = require("./doctorlogin.jpg");
const axios = require('axios');
export class Login extends Component {
    constructor(props){
        super(props);
        this.state={
            authorize: false,
            user_id: '',
            username: '',
            patient_email: '',
            load:false,
            id:this.props.name==='patient'?p2:d2
        }
        this.authorize = this.authorize.bind(this);
        this.comebackfromView = this.comebackfromView.bind(this);
    }

    comebackfromView(){
            this.setState({
            authorize: false,
            user_id: '',
            username: '',
            patient_email: '',
            id:this.props.name==='patient'?p2:d2
        })
    }

    async authorize(e){
        this.setState({
            load:true
        })
        const password = document.getElementById('password').value;
        const email = document.getElementById('email').value;
        console.log(email);
        console.log(password);
        let route = 'doctor_auth';
        if(this.props.name==='patient')
            route = 'patient_auth';
        const data = await axios.post("http://localhost:8000/"+route, {'username': email, 'password':password})
            .then(jsonResponse=>{
                console.log(jsonResponse);
                return jsonResponse.data;
            })
            .catch(error=>{
                console.log(error);
            })
        if(!data.auth)
            alert("Invalid Username or Password!!! Try Again!!");
        this.setState({
            authorize: data.auth,
            user_id: data.id,
            username: data.username,
            patient_email: email,
            load:false,
            id:this.props.name==='patient'?p2:d2
        })
        console.log(this.state.authorize);
        console.log(this.state.user_id);
        console.log(this.state.username);
    }

    changeid(){
        
        if(this.props.name==="patient"){
                    this.setState({
                        id : p2
                    });
                    console.log("called");
        }
    }

  	render(){
        const style = {
               'backgroundImage':`url(${this.state.id})`,
              'backgroundPosition': 'center',
              'backgroundSize': 'cover',
              'backgroundRepeat': 'no-repeat',
              'textAlign': 'center',
              'border' : '1px solid black'
        }

        let heading = (<h1 style={{'color':'white'}}>Patients' Login</h1>);
        let heading1 = (<h1>Doctors' Login</h1>);
        let img = (<img src={d} height="200" width="200" alt="doctors'login"/>)
        let img2 = (<img src={p} height="200" width="200" alt="patients'login"/>)
        let login=(
            <div id="login" style={style}>
                   {this.props.name==='patient'? heading : heading1}
                   {this.props.name==='patient'? img2 : img}
                    <div className="loginpage">
                        <div className="log-form">
                            <h2>Login to your account</h2>
                            <div>
                                <input type="text" id="email" className="loginip" placeholder="User Email"/><br></br>
                                <input type="password" id="password" className="loginip" placeholder="Password"/><br></br>
                                {this.state.load?<div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>:''}
                                <div type="submit" onClick={this.authorize} className="btn">Login</div><br></br>
                                <a className="forgot" href="#">Forgot Username?</a><br></br>
                                <div onClick={this.props.back} className="btn">Exit</div>
                            </div>
                        </div>
                    </div>
            </div>
        );
    	return (
            <div >
            {this.props.name==='patient'? <div> {this.state.authorize ? <Patient changeid={this.changeid} goback={this.comebackfromView} email={this.state.patient_email} name={this.state.username} id={this.state.user_id}/> : login } </div>
                 : <div> {this.state.authorize ? <Doctor goback={this.comebackfromView} name={this.state.username} id={this.state.user_id}/> : login } </div> }
            </div>
    	)
  }
}
export default Login;