import React, { Component } from 'react';
import { CustomerData } from './Customer';


export class AddCustomer extends Component {
    constructor(props) {
        super(props);

        this.state = { title: "", loading: true,  ctmData: new CustomerData }; 

        var ctmId = this.props.match.params["ctmid"];

        //this will set state for Edit customer
        if (ctmId > 0) {
            fetch('api/Customers/Details/' + ctmId)
                .then(response => response.json())
                .then(data => {
                    this.setState({ title: "Edit", loading: false, ctmData: data });
                });
        }
        //This will set state for Add customer
        else {
            this.state = { title: "Create", loading: false, ctmData: new CustomerData};
        }

        //This binding is necessary to make "this" work in the callback
        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderCreateForm();

        return <div>
            <h1>{this.state.title}</h1>
            <h3>Customer</h3>
            <hr />
            {contents}
        </div>;
    }
    //This will handle the submit form event.
    handleSave(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        var ID = this.state.ctmData.id;

        //PUT request for Edit customer.
        if (ID) {
            fetch('api/Customers/Edit/' + ID, {
                method: 'PUT',
                body: data,
            }).then((response) => response.json())
                .then((responseJson) => {
                    this.props.history.push("/fetchcustomer");
                })
        }

        //POST request for Add customer
        else {
            //console.log("Add customer method is trigered")
            fetch('api/Customers/Create', {
                method: 'POST',
                body: data,
            }).then((response) => response.json())
                .then((responseJson) => {
                    this.props.history.push("/fetchcustomer");
            })
        }
    }

    //This will handle Cancel button click event
    handleCancel(e) {
        e.preventDefault();
        this.props.history.push("/fetchcustomer");
    }
    //Return the HTML form to the render() method
    renderCreateForm() {
        return (
            <form onSubmit={this.handleSave} >
                <div className="form-group row">
                    <input type="hidden" name="customerId" value={this.state.ctmData.customerId} />
                </div>
                <div className="form-group row">
                    <label className="control-label col-md-12" htmlFor="Name">Name</label>
                    <div className="col-md-4">
                        <input className="form-control" type="text" name="name" defaultValue={this.state.ctmData.name} required />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="control-label col-md-12" htmlFor="Address">Address</label>
                    <div className="col-md-4">
                        <input className="form-control" type="text" name="address" defaultValue={this.state.ctmData.address} required />
                    </div>
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-default">Save</button>
                    <button className="btn" onClick={this.handleCancel}>Cancel</button>
                </div>
            </form>
        )
    }
}