import React, { Component } from 'react';
import CanvasJSReact from '../assets/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
 
export class LineChart extends Component {
	render() {
		const data=this.props.data;
	//const data1=this.props.ar1;
	//console.log(data);
	//console.log(data1);
		const options = {
			animationEnabled: true,
			exportEnabled: true,
			backgroundColor: '#d1e0e0',
			theme: "light2", // "light1", "dark1", "dark2"

			title:{
				text: this.props.which==='l'?"Locationwise Disease Counts": this.props.which==='d'?"Diseasewise Location Counts":"Diseasewise Age Counts"
			},
			axisY: {
				title: "Cases",
				includeZero: false,
				interval:1
			},
			axisX: {
				title: this.props.which==="l"?"Disease":this.props.which==="d"?"City":"Age"
			},
			data: [{
				type: "splineArea",
				toolTipContent: "{label}: {y}",
				dataPoints: data
				/*[
					{ label: 'a', y: 64 },
					{ label: 'b', y: 61 },
					{ label: 'c', y: 64 },
					{ label: 'd', y: 62 }]*/
			}]
		}
		const options2 = {
			animationEnabled: true,
			exportEnabled: true,
			backgroundColor: '#d1e0e0',
			theme: "light2", // "light1", "dark1", "dark2"
			
			title:{
				text: "Monthly data"
			},
			axisY: {
				title: "Air Quality Index",
				includeZero: false,
				interval:50
				
			},
			axisX: {
				title: "Date",
				prefix: "",
				interval: 1
			},
			data: [{
				type: "splineArea",
				toolTipContent: "Day {x}: AQI {y}",
				dataPoints: []
				
			}]

		}
		return (
		<div style={{'width':'100%', 'textAlign':'center'}}>
			<CanvasJSChart options = {options} 
				/* onRef={ref => this.chart = ref} */
			/>
			<div style={{'width':'1200px'}}></div>
			{this.props.which==="l"?<button onClick={this.props.back}>Back</button>:''}
		</div>
		);
	}
}

export default LineChart;