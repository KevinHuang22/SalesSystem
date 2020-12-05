import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { CustomerData } from './Customer';

export class ShowCustomer extends Component {
    constructor(props) {
        super(props);

        this.state = { title: "", loading: true, salesList:[], ctmData: new CustomerData };

        fetch('api/Customer/GetSalesList')
            .then(response => response.json())
            .then(data => {
                this.setState({ salesList: data }); 
            });

        var ctmId = this.props.match.params["ctmid"];

        fetch('api/Customers/Details/' + ctmId)
            .then(response => response.json())
            .then(data => {
                this.setState({ title: "Details", loading: false, ctmData: data });
            });
        
        //This binding is necessary to make "this" work in the callback
        //this.handleSave = this.handleSave.bind(this);
        //this.handleCancel = this.handleCancel.bind(this);
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderCreateForm();
        let sales = this.state.loading 
            ? <p><em>Loading...</em></p>
            : this.renderSalesTable(this.state.salesList);
        return <div>
            <div>
                <h1>{this.state.title}</h1>
                <h3>{this.state.ctmData.name}</h3>
                <hr />
                {contents}
            </div>
            <div>
                <h3>Sales</h3>
            {sales}
            </div>
        </div>;
        }
    
    renderCreateForm() {
        return (
            <form onSubmit={this.handleSave} >
                <div className="form-group row" >
                    <input type="hidden" name="customerId" value={this.state.ctmData.customerId} />
                </div>
                < div className="form-group row" >
                    <label className=" control-label col-md-12" htmlFor="Name">Name</label>
                    <label className=" control-label col-md-12" htmlFor="Name">{this.state.ctmData.name}</label>
                </div >
                <div className="form-group row">
                    <label className="control-label col-md-12" htmlFor="Address" >Address</label>
                    <label className=" control-label col-md-12" htmlFor="Name" >{this.state.ctmData.Address}</label>
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-default">Save</button>
                    <button className="btn" onClick={this.handleCancel}>Cancel</button>
                </div >
            </form >
        )
    }  

    renderSalesTable(salesList) {
        return <table className="table">
            <thead>
                <tr>
                    <th></th>
                    <th>Sales ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Actions</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {salesList.map(sales =>
                    <tr key={sales.id}>
                        <td></td>
                        <td>{sales.id}</td>
                        <td>{sales.name}</td>
                        <td>{sales.price}</td>
                        <td>
                            <Link className="btn btn-success" to={"/customer/edit/" + sales.id} >Edit</Link>
                        </td>
                        <td>
                            <button type="button" onClick={(e) => this.handleDelete(sales.id)} className="btn btn-danger">Delete</button>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>;

    }
}