import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class Sales extends Component {
    constructor(props) {
        super(props);
        this.state = { salesList: [], loading: true };

        //this.state = {
        //    salesList: [], loading: true, customerList: [], productList: [],
        //    storeList: []
        //};

        //fetch('api/Sales/GetCustomerList')
        //    .then(response => response.json())
        //    .then(data => {
        //        this.setState({ customerList: data });
        //    });

        //fetch('api/Sales/GetProductList')
        //    .then(response => response.json())
        //    .then(data => {
        //        this.setState({ productList: data });
        //    });

        //fetch('api/Sales/GetStoreList')
        //    .then(response => response.json())
        //    .then(data => {
        //        this.setState({ storeList: data });
        //    }); 


        fetch('api/Sales/Index')
            .then(response => response.json())
            .then(data => {
                this.setState({ salesList: data, loading: false });
            });

        //this binding is neccessary to make "this" work in the callback
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderSalesTable(this.state.salesList);

        return <div>
            <h1>Sales</h1>
            <p>This component demostrates fetching Sales data from the server.</p>
            <p>
                <Link to="/addSales">Create New</Link>
            </p>
            {contents}
        </div>;
    }

    //Handle Delete request for an sales
    handleDelete(id) {
        if (!window.confirm("Do you want to delete sales with Id: " + id))
            return;
        else {
            fetch('api/Sales/Delete/' + id, {
                method: 'delete'
            }).then(response => response.json())
                .then(data => {
                    console.log(data);
                });
            const newCtmList = this.state.salesList.filter(salesList => {
                return salesList.id !== id;
            });

            this.setState({
                salesList: [...newCtmList]
            });
        }
    }

    handleEdit(id) {
        this.props.history.push("sales/edit/" + id);
    }

    //returns the html table to the render() method.
    renderSalesTable(salesList) {
        return <table className="table">
            <thead>
                <tr>
                    <th></th>
                    <th>Sales ID</th>
                    <th>Product</th>
                    <th>Customer</th>
                    <th>Store</th>
                    <th>Actions</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {salesList.map(sales =>
                    <tr key={sales.id}>
                        <td></td>
                        <td>{sales.id}</td>
                        <td>{sales.product.name}</td>
                        <td>{sales.customer.name}</td>
                        <td>{sales.store.name}</td>
                        <td>
                            <Link className="btn btn-success" to={"/sales/edit/" + sales.id} >Edit</Link>
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


export class SalesData {
    salesId = 0;
    productId = 0;
    customerId = 0;
    storeId = 0;
    dateSold = new Date();
}