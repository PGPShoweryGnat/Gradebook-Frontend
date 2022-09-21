import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import {DataGrid} from '@mui/x-data-grid';
import {SERVER_URL} from '../constants.js'
import TextField from '@mui/material/TextField';

// NOTE:  for OAuth security, http request must have
//   credentials: 'include' 
//

class Assignment extends React.Component {
    constructor(props) {
      super(props);
      this.state = {selected: 0, assignments: [], name:"",date:"",title:""};
    };
 
   componentDidMount() {
    this.fetchAssignments();
  }
  handlesubmit = (a) => {
	console.log("Anything")
	console.log(a)
	console.log(a.target)
	console.log(a.target.name)
	console.log(a.target.value)
	console.log(this.state)

	console.log(this.state.assignments[0])
	console.log("Assignment.handleSubmit");
		console.log(a)
      
      const token = Cookies.get('XSRF-TOKEN');
 fetch(`${SERVER_URL}/assignment` , 
          {  
	    
            method: 'POST', 
            headers: { 'Content-Type': 'application/json',
                       'X-XSRF-TOKEN': token }, 
            body: JSON.stringify({    "assignmentName": this.state.name, "dueDate": this.state.date, "courseTitle": this.state.title})
          } )
      .then(res => {
          if (res.ok) {
            toast.success("Grades successfully updated", {
            position: toast.POSITION.BOTTOM_LEFT
            });
            //this.fetchGrades();
          } else {
            toast.error("Grade updated failed", {
            position: toast.POSITION.BOTTOM_LEFT
            });
            console.error('Put http status =' + res.status);
      }return res;})
	.then(res => res.json())
	.then(res => {
		console.log(res)
		let temp1 = [...this.state.assignments,...[res]];
		let assignments = this.state.assignments;
		let temp = {assignments:temp1};
		
		//this.setState(temp);
		//console.log(temp.target)
	   
      
			
		})

        .catch(err => {
          toast.error("Grade updated failed", {
            position: toast.POSITION.BOTTOM_LEFT
          });
          console.error(err);
        });
}
handleChange = (event) => {
	switch(event.target.name){
		case "assignmentName":
		this.setState({name: event.target.value}); break;
		case "dueDate":
		this.setState({date: event.target.value}); break;
		case "courseTitle":
		this.setState({title: event.target.value}); break;
		


	}
}
  fetchAssignments = () => {
    console.log("Assignment.fetchAssignments");
    const token = Cookies.get('XSRF-TOKEN');
    fetch(`${SERVER_URL}/gradebook`, 
      {  
        method: 'GET', 
        headers: { 'X-XSRF-TOKEN': token }
      } )
    .then((response) => response.json()) 
    .then((responseData) => { 
      if (Array.isArray(responseData.assignments)) {
        //  add to each assignment an "id"  This is required by DataGrid  "id" is the row index in the data grid table 
        this.setState({ assignments: responseData.assignments.map((assignment, index) => ( { id: index, ...assignment } )) });
      } else {
        toast.error("Fetch failed.", {
          position: toast.POSITION.BOTTOM_LEFT
        });
      }        
    })
    .catch(err => console.error(err)); 
  }
  
   onRadioClick = (event) => {
    console.log("Assignment.onRadioClick " + event.target.value);
    this.setState({selected: event.target.value});
  }
  
  render() {
     const columns = [
      {
        field: 'assignmentName',
        headerName: 'Assignment',
        width: 400,
        renderCell: (params) => (
          <div>
          <Radio
            checked={params.row.id == this.state.selected}
            onChange={this.onRadioClick}
            value={params.row.id}
            color="default"
            size="small"
          />
          {params.value}
          </div>
        )
      },
      { field: 'courseTitle', headerName: 'Course', width: 300 },
      { field: 'dueDate', headerName: 'Due Date', width: 200 }
      ];
      
      const assignmentSelected = this.state.assignments[this.state.selected];
      return (
          <div align="left" >
            <h4>Assignment(s) ready to grade: </h4>
              <div style={{ height: 450, width: '100%', align:"left"   }}>
                <DataGrid rows={this.state.assignments} columns={columns} />
              </div>                
            <Button component={Link} to={{pathname:'/gradebook',   assignment: assignmentSelected }} 
                    variant="outlined" color="primary" disabled={this.state.assignments.length===0}  style={{margin: 10}}>
              Grade
            </Button>
            <Button onClick ={this.handlesubmit} to={{pathname:'/assignment',   assignment: assignmentSelected }}
                   variant="outlined" style={{margin: 10}}>
              New Assignment
            </Button>
            <TextField autoFocus style = {{width:200}} label="Name" name="assignmentName" 
             onChange={this.handleChange}/>
            <TextField autoFocus style = {{width:200}} label="Due Date" name="dueDate" 
             onChange={this.handleChange}/> 
            <TextField autoFocus style = {{width:200}} label="Course" name="courseTitle" 
             onChange={this.handleChange}/> 
            <ToastContainer autoClose={1500} /> 
          </div>
      )
  }
}  

export default Assignment;