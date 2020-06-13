import React, {Component} from 'react';
import Admin from './Admin.js';
import './App.css';
import $ from 'jquery';
import Login from './Login.js';
import {findDOMNode} from 'react-dom';
const BrowserRouter = require("react-router-dom").BrowserRouter;
const Route = require("react-router-dom").Route;
const Link = require("react-router-dom").Link;
const Switch = require("react-router-dom").Switch;
const axios = require('axios');
const p = require("./p.png");
const d = require("./d.png");

export class App extends Component {
	constructor(props){
		super(props);
		this.state = {
			name : 'doctor',
			admin:false,
			home: true,
			login:false,
			img:''
		};
		this.patient = this.patient.bind(this);
		this.doctor = this.doctor.bind(this);
		//this.login = this.login.bind(this);
		this.backtomain = this.backtomain.bind(this);
	}

	patient(){
		const el = findDOMNode(this.refs.toggle);
		$(el).fadeToggle('medium');
		setTimeout(()=>{
			this.setState({
				name: 'patient',
				home: false,
				login:true
			})
		},900);
		//console.log("patient set");
	}

	async doctor(){
		const el = findDOMNode(this.refs.toggle);
		$(el).fadeToggle('medium');
		await setTimeout(()=>{
			this.setState({
				name: 'doctor',
				home: false,
				login: true
			})
		},900);
		//console.log("doctor set");
		//console.log(this.state);
	}
	backtomain(){
		this.setState({
			name : '',
			home: true,
			login:false,
			admin:false
		})
	}

	handleAdmin(){
		this.setState({
			home:false,
			login:false,
			admin:true
		})

	}

  	render(){
  		const home = (<div ref="toggle"><div>
					    <header >
					        <nav>
					          <ul>
					            <BrowserRouter>
					            	<Link to="/about"><li> About </li></Link>
					            	<Switch>
					            		<Route path="/about">
            								<h1>This is about.</h1>
          								</Route>
					            	</Switch>
					            </BrowserRouter><li> Work </li> <li onClick={this.handleAdmin.bind(this)}> Admin </li> <li> Contact </li>
					          </ul>
					        </nav>
					    </header>
					    <main>
					      <div className="jumbotron">
					        <div className="container">  
					          <h1>Welcome to e-Health</h1>
					            <div className="home">
					    		    <div className="container">
					    		    	<div className="imagecontainer">
					    			   		<img id="c" onClick={this.doctor} src={d} height="400" width="400" alt="doctors'login"/>
					    			   		<img id="c" onClick={this.patient} src={p} height="400" width="400" alt="patients'login"/>
					    			   	</div>
					    			    </div>
					    			</div>
					    	</div>
					      </div>
					    </main>
					  </div></div>)
  		

    	return (
    		<div>
				{this.state.admin ? <Admin back={this.backtomain}/> : ''}
			  	{this.state.home ? home : '' }
			  	{this.state.login? <Login back={this.backtomain} name={this.state.name}/> : ''}
			</div>
		)
	}
}
export default App;