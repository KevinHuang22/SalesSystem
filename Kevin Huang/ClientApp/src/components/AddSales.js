import React, { Component } from 'react';
import { SalesData } from "./Sales";


export class AddSales extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: "", loading: true, customerList: [], productList: [],
            storeList:[], salesData: new SalesData
        };

        fetch('api/Sales/GetCustomerList')
            .then(response => response.json())
            .then(data => {
                this.setState({ customerList: data });
            }); 

        fetch('api/Sales/GetProductList')
            .then(response => response.json())
            .then(data => {
                this.setState({ productList: data });
            }); 

        fetch('api/Sales/GetStoreList')
            .then(response => response.json())
            .then(data => {
                this.setState({ storeList: data });
            }); 

        var salesId = this.props.match.params["salesid"];

        //this will set state for Edit sales
        if (salesId > 0) {
            fetch('api/Sales/Details/' + salesId)
                .then(response => response.json())
                .then(data => {
                    this.setState({ title: "Edit", loading: false, salesData: data });
                });
        }
        //This will set state for Add sales
        else {
            this.state = {
                title: "Create", loading: false,
                customerList: [], productList: [], storeList: [],
                salesData: new SalesData
            }
        }

        //This binding is necessary to make "this" work in the callback
        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderCreateForm(this.state.customerList, this.state.productList, this.state.storeList);

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
        var ID = this.state.salesData.id;

        //PUT request for Edit sales.
        if (ID) {
            fetch('api/Sales/Edit/' + ID, {
                method: 'PUT',
                body: data,
            }).then((response) => response.json())
                .then((responseJson) => {
                    this.props.history.push("/fetchsales");
                })
        }
        //POST request for Add sales
        else {
            console.log(data);
            fetch('api/Sales/Create', {
                method: 'POST',
                body: data,
            }).then((response) => response.json())
                .then((responseJson) => {
                    this.props.history.push("/fetchsales");
            })
        }
    }

    //This will handle Cancel button click event
    handleCancel(e) {
        e.preventDefault();
        this.props.history.push("/fetchsales");
    }

    //Return the HTML form to the render() method
    renderCreateForm(customerList, productList, storeList) {
        return (
            <form onSubmit={this.handleSave} >
                <div className="form-group row">
                    <input type="hidden" name="salesId" value={this.state.salesData.id} />
                </div>
                <div className="form-group row">
                    <label className="control-label col-md-12" htmlFor="Customer">CustomerID</label>
                    <div className="col-md-4">
                        <select className="form-control" data-val="true" name="customerId" defaultValue={this.state.salesData.customer} required>
                            <option>-- Select Customer --</option>
                            {customerList.map(customer =>
                                <option key={customer.id} value={customer.id}>{customer.name}</option>
                            )}
                        </select>
                    </div>
                </div >
                <div className="form-group row">
                    <label className="control-label col-md-12" htmlFor="Product">Product</label>
                    <div className="col-md-4">
                        <select className="form-control" data-val="true" name="productId" defaultValue={this.state.salesData.product} required>
                            <option>-- Select Product --</option>
                            {productList.map(product =>
                                <option key={product.id} value={product.id}>{product.name}</option>
                            )}
                        </select>
                    </div>
                </div >  
                <div className="form-group row">
                    <label className="control-label col-md-12" htmlFor="Store">Store</label>
                    <div className="col-md-4">
                        <select className="form-control" data-val="true" name="StoreId" defaultValue={this.state.salesData.store} required>
                            <option>-- Select Store --</option>
                            {storeList.map(store =>
                                <option key={store.id} value={store.id}>{store.name}</option>
                            )}
                        </select>
                    </div>
                </div> 
                <div className="form-group row">
                    <input name="DateSold" defaultValue={this.state.salesData.DateSold ? this.state.salesData.DateSold:new Date()} />
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-default">Save</button>
                    <button className="btn" onClick={this.handleCancel}>Cancel</button>
                </div>
            </form>
        )
    }
}