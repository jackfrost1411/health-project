import React, {Component} from 'react';
import './Admin.css';
import LineChart from './components/Line Chart';
const axios = require('axios');
//const url="newpro-env.q4mxnbtu3g.us-east-1.elasticbeanstalk.com";
const url="localhost:8001";
export class Admin extends Component {
	constructor(props){
		super(props);
		this.state = {
			locationwise:[],
			counts:{},
			uniqueValues:[],
			uniqueValues2:[],
			chartLocationData:[],
			chartLocationData2:[],
			location:'',
			l:false,
			d:false,
			a:false,
			disease:''
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.fetchLocationwise = this.fetchLocationwise.bind(this);
		this.fetchDiseasewise = this.fetchDiseasewise.bind(this);
		this.back = this.back.bind(this);
		this.back2 = this.back2.bind(this);
	}

	async fetchLocationwise(){
		await this.setState({
			location: document.getElementById('location').value.trim()
		});
		console.log(this.state.location);
		await axios.post('http://localhost:8001/locationwise', {"location": this.state.location}).then(
			json=>{
				//console.log(json['data']['chain']);
				var counts = {};
				for (var i = 0; i < json['data']['chain'].length; i++) {
		    		counts[json['data']['chain'][i]] = 1 + (counts[json['data']['chain'][i]] || 0);
				}
				const uniqueValues = [...new Set(json['data']['chain'])]; 
				this.setState({
					locationwise:json['data']['chain'],
					counts:counts,
					uniqueValues:uniqueValues
				})
			})
		const ar = [];
		for(let i=0; i<this.state.uniqueValues.length; i++){
			let obj={};
			obj['label'] = this.state.uniqueValues[i];
			obj['y'] = this.state.counts[this.state.uniqueValues[i]]
			ar.push(obj);
		} 
		this.setState({
			chartLocationData:ar
		})
		console.log(this.state.chartLocationData);
		console.log(this.state.counts);
		console.log(this.state.locationwise);
		console.log(this.state.uniqueValues);
	}

	async fetchDiseasewise(){
		await this.setState({
			disease: document.getElementById('disease').value.trim()
		});
		console.log(this.state.disease);
		await axios.post('http://'+url+'/diseasewise', {"disease": this.state.disease}).then(
			json=>{
				var counts = {};
				for (var i = 0; i < json['data']['chain'].length; i++) {
		    		counts[json['data']['chain'][i]] = 1 + (counts[json['data']['chain'][i]] || 0);
				}
				const uniqueValues = [...new Set(json['data']['chain'])]; 
				this.setState({
					locationwise:json['data']['chain'],
					counts:counts,
					uniqueValues:uniqueValues
				})
			})
		const ar = [];
		for(let i=0; i<this.state.uniqueValues.length; i++){
			let obj={};
			obj['label'] = this.state.uniqueValues[i];
			obj['y'] = this.state.counts[this.state.uniqueValues[i]]
			ar.push(obj);
		} 

		await axios.post('http://'+url+'/diseasewiseage', {"disease": this.state.disease}).then(
			json=>{
				var counts = {};
				for (var i = 0; i < json['data']['chain'].length; i++) {
		    		counts[json['data']['chain'][i]] = 1 + (counts[json['data']['chain'][i]] || 0);
				}
				const uniqueValues = [...new Set(json['data']['chain'])]; 
				this.setState({
					locationwise:json['data']['chain'],
					counts:counts,
					uniqueValues2:uniqueValues.sort()
				})
			})
		const ar2 = [];
		for(let i=0; i<this.state.uniqueValues2.length; i++){
			let obj={};
			obj['label'] = this.state.uniqueValues2[i];
			obj['y'] = this.state.counts[this.state.uniqueValues2[i]]
			ar2.push(obj);
		} 

		this.setState({
			chartLocationData:ar,
			chartLocationData2:ar2
		})

		console.log(this.state.chartLocationData);
		console.log(this.state.counts);
		console.log(this.state.locationwise);
		console.log(this.state.uniqueValues);
	}

	async handleSubmit(){
		console.log(this.state.location);
		this.fetchLocationwise();
	}

	back(){
		this.setState({
			locationwise:[],
			counts:{},
			uniqueValues:[],
			chartLocationData:[],
			location:'',
			l:false,
			d:false,
			a:false
		})
	}

	handlel(){
		this.setState({
			l:true,
			d:false,
			a:false
		})
	}

	handled(){
		this.setState({
			d:true,
			a:true,
			l:false
		})
	}

	back2(){
		this.setState({
			d:false,
			l:false,
			a:false
		})
	}

  	render(){

  		const lwise=(
  			<LineChart back={this.back} which="l" disease={this.state.disease} location={this.state.location} data={this.state.chartLocationData}/>
  		)

  		const dwise=(
  			<div style={{'textAlign':'center'}}>
  			<LineChart back={this.back} which="d" disease={this.state.disease} location={this.state.location} data={this.state.chartLocationData}/>
  			<br></br>
  			<LineChart back={this.back} which="a" disease={this.state.disease} location={this.state.location} data={this.state.chartLocationData2}/>
  			<button onClick={this.back}>Back</button>
  			</div>
  		)

  		const i = (
  			<div className='i1'>
  				<h3>Location Analysis</h3><br></br>
  				<input type="text" id="location" placeholder="Enter the Location"/><br></br>
  				<input type="submit" value="submit" onClick={this.fetchLocationwise}/>
  				<div style={{'display':'flex','justifyContent':'center','alignItems':'center'}}>{this.state.chartLocationData?<button onClick={this.back2}>Back</button>:''}</div>
  			</div>
  		)

  		const i2 = (
  			<div className='i2'>
  				<h3>Disease Analysis</h3><br></br>
  				<input type="text" id="disease" placeholder="Enter the Disease"/><br></br>
  				<input type="submit" value="submit" onClick={this.fetchDiseasewise}/>
  				<div style={{'display':'flex','justifyContent':'center','alignItems':'center'}}>{this.state.chartLocationData?<button onClick={this.back2}>Back</button>:''}</div>
  			</div>
  		)

  		return (
  			<div  className='adminhome'>
  				{!this.state.l && !this.state.d
  					?<div style={{'height':'500px','display':'flex','justifyContent':'center','alignItems':'center'}}>
  						<div className="labels">
  				  		<input className="ad" type="submit" value="Location Wise" onClick={this.handlel.bind(this)}/><br></br>
  				  		<input className="ad" type="submit" value="Disease Wise" onClick={this.handled.bind(this)}/>
  						<div style={{'display':'flex','justifyContent':'center','alignItems':'center'}}>{this.state.chartLocationData?<button onClick={this.props.back}>Back</button>:''}</div>
  				  		</div>
  				  	</div>:''}

  				{this.state.l?<div style={{'display':'flex','justifyContent':'center','alignItems':'center'}}>{this.state.chartLocationData.length?lwise:i}</div>:''}
  				{this.state.d?<div style={{'display':'flex','justifyContent':'center','alignItems':'center'}}>{this.state.chartLocationData.length?dwise:i2}</div>:''}
  			</div>
  		)
	}
}
export default Admin;