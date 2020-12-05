import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class Customer extends Component {
    constructor(props) {
        super(props);
        this.state = { ctmList: [], loading: true };
        fetch('api/Customers/Index')
            .then(response => response.json())
            .then(data => {
                this.setState({ ctmList: data, loading: false });
            });

        //this binding is neccessary to make "this" work in the callback
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderCustomerTable(this.state.ctmList);

        return <div>
            <h1>Customers</h1>
            <p>This component demostrates fetching Customer data from the server.</p>
            <p>
                <Link to="/addCustomer">Create New</Link>
            </p>
            {contents}
        </div>;
    }

    //Handle Delete request for an customer
    handleDelete(id) {
        if (!window.confirm("Do you want to delete customer with Id: " + id))
            return;
        else {
            fetch('api/Customers/Delete/' + id, {
                method: 'delete'
            }).then(response => response.json())
              .then(data => {
                  console.log(data);
              });
            const newCtmList = this.state.ctmList.filter(ctmList => {
                return ctmList.id !== id;
            });

            this.setState({
                ctmList: [...newCtmList]
            });
        }
    }

    handleEdit(id) {
        this.props.history.push("customers/edit/" + id);
    }

    //returns the html table to the render() method.
    renderCustomerTable(ctmList) {
        return <table className="table">
            <thead>
                <tr>
                    <th></th>
                    <th>Customer ID</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Actions</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {ctmList.map(ctm =>
                    <tr key={ctm.id}>
                        <td></td>
                        <td>{ctm.id}</td>
                        <td>
                            <Link to={"/ShowCustomer/" + ctm.id}>{ctm.name}</Link>
                        </td>
                        <td>{ctm.address}</td>
                        <td>
                            <Link className="btn btn-success" to={"/customer/edit/" + ctm.id} >Edit</Link>
                        </td>
                        <td>
                            <button type="button" onClick={(e) => this.handleDelete(ctm.id)} className="btn btn-danger">Delete</button>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>;
    
    }
}


export class CustomerData {
    customerId = 0;
    name = "";
    address = "";
}