import React, { Component } from 'react';
import { ProductData } from './Product';


export class AddProduct extends Component {
    constructor(props) {
        super(props);

        this.state = { title: "", loading: true, name: "", price: 0.0, prdtData: new ProductData };

        var prdtId = this.props.match.params["prdtid"];

        //this will set state for Edit product
        if (prdtId > 0) {
            fetch('api/Products/Details/' + prdtId)
                .then(response => response.json())
                .then(data => {
                    this.setState({ title: "Edit", loading: false, prdtData: data });
                })
        }
        //this will set state for Add product
        else {
            this.state = { title: "Create", loading: false, productSold: [], prdtData: new ProductData() };
        }
        //This binding is necessary to make "this" work in the callback
        this.handleSave = this.handleSave.bind(this);
        this.hanldCancel = this.handleCancel.bind(this);
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading</em></p>
            : this.renderCreateForm(this.state.sales);

        return <div>
            <h1>{this.state.title}</h1>
            <h3>Product</h3>
            <hr />
            {contents}
        </div>;
    }

    //This will handle the submit form event.
    handleSave(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        var ID = this.state.prdtData.id;

        //PUT request for Edit product.
        if (ID) {
            fetch('api/Products/Edit/' + ID, {
                method: 'PUT',
                body:data,
            }).then((response) => response.json())
                .then((responseJson) => {
                    this.props.history.push("/fetchproduct");
                })
        }

        //POST request for Add customer
        else {
            fetch('api/Products/Create', {
                method: 'POST',
                body: data,
            }).then((response) => response.json())
                .then((responseJson) => {
                    this.props.history.push("/fetchproduct");
                })
        }
    }

    //This will handle Cancel button click event
    handleCancel(e) {
        e.preventDefault();
        this.props.history.push("/fetchproduct");
    }

    //Reuturn the HTML form to the render() method
    renderCreateForm() {
        return (
            <form onSubmit={this.handleSave}>
                <div className="form-group row">
                    <input type="hidden" name="productId" value={this.state.prdtData.id} />
                </div>
                <div className="form-group row">
                    <label className="control-label col-md-12" htmlFor="Name">Name</label>
                    <div className="col-md-4">
                        <input className="form-control" type="text" name="name" defaultValue={this.state.prdtData.name} required />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="control-label col-md-12" htmlFor="Price">Price</label>
                    <div className="col-md-4">
                        <input className="form-control" type="text" name="price" defaultValue={this.state.prdtData.price} required />
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