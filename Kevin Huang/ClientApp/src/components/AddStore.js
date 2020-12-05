import React, { Component } from 'react';
import { StoreData } from './Store';


export class AddStore extends Component {
    constructor(props) {
        super(props);

        this.state = { title: "", loading: true, name: "", address: "", storeData: new StoreData };

        var storeId = this.props.match.params["storeid"];

        //this will set state for Edit store
        if (storeId > 0) {
            fetch('api/Stores/Details/' + storeId)
                .then(response => response.json())
                .then(data => {
                    this.setState({ title: "Edit", loading: false, storeData: data });
                });
        }
        //This will set state for Add store
        else {
            this.state = { title: "Create", loading: false, sales: [], storeData: new StoreData };
        }

        //This binding is necessary to make "this" work in the callback
        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderCreateForm(this.state.sales);

        return <div>
            <h1>{this.state.title}</h1>
            <h3>Store</h3>
            <hr />
            {contents}
        </div>;
    }
    //This will handle the submit form event.
    handleSave(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        var ID = this.state.storeData.id;

        //PUT request for Edit store.
        if (ID) {
            fetch('api/Stores/Edit/' + ID, {
                method: 'PUT',
                body: data,
            }).then((response) => response.json())
                .then((responseJson) => {
                    this.props.history.push("/fetchstore");
                })
        }

        //POST request for Add store
        else {
            fetch('api/Stores/Create', {
                method: 'POST',
                body: data,
            }).then((response) => response.json())
                .then((responseJson) => {
                    this.props.history.push("/fetchstore");
                })
        }
    }

    //This will handle Cancel button click event
    handleCancel(e) {
        e.preventDefault();
        this.props.history.push("/fetchstore");
    }
    //Return the HTML form to the render() method
    renderCreateForm() {
        return (
            <form onSubmit={this.handleSave} >
                <div className="form-group row">
                    <input type="hidden" name="storeId" value={this.state.storeData.id} />
                </div>
                <div className="form-group row">
                    <label className="control-label col-md-12" htmlFor="Name">Name</label>
                    <div className="col-md-4">
                        <input className="form-control" type="text" name="name" defaultValue={this.state.storeData.name} required />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="control-label col-md-12" htmlFor="Address">Address</label>
                    <div className="col-md-4">
                        <input className="form-control" type="text" name="address" defaultValue={this.state.storeData.address} required />
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