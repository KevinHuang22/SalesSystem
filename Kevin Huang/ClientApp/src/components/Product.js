import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class Product extends Component {
    constructor(props) {
        super(props);
        this.state = { prdtList: [], loading: true };
        fetch('api/Products/Index')
            .then(response => response.json())
            .then(data => {
                this.setState({ prdtList: data, loading: false });
            });

        //this.binding is neccessary to make "this" work in the call back
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderProductTable(this.state.prdtList);

        return <div>
            <h1>Product</h1>
            <p>This component demostrates fetching Product data from the server.</p>
            <p>
                <Link to="addProduct">Create New</Link>
            </p>
            {contents}
        </div>;
    }

    //Handle delete request for an product
    handleDelete(id) {
        if (!window.confirm("Do you want to delete product with Id: " + id)) {
            return;
        }
        else {
            fetch("api/Products/Delete/" + id, {
                method: 'delete'
            }).then(response => response.json())
                .then(data => {
                    console.log(data);
                })

            const newPrdtList = this.state.prdtList.filter(prdtList => {
                return prdtList.id != id;
            });

            this.setState({
                prdtList: [...newPrdtList]
            });
        }
    }

    handleEdit(id) {
        this.props.history.push("products/edit/" + id);
    }

    //returns the html table to the render() method.
    renderProductTable(prdtList) {
        return <table className="table">
            <thead>
                <tr>
                    <th></th>
                    <th>Product ID</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Actions</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {prdtList.map(prdt =>
                    <tr key={prdt.id}>
                        <td></td>
                        <td>{prdt.id}</td>
                        <td>{prdt.name}</td>
                        <td>{prdt.price}</td>
                        <td>
                            <Link className="btn btn-success" to={"/product/edit/" + prdt.id}>Edit</Link>
                        </td>
                        <td>
                            <button type="button" onClick={(e) => this.handleDelete(prdt.id)} className="btn btn-danger">Delete</button>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    }
}

export class ProductData {
    productId = 0;
    name = "";
    price = 0.00;
}
