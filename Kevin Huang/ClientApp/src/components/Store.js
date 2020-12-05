import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class Store extends Component {
    constructor(props) {
        super(props);
        this.state = { storeList: [], loading: true };
        fetch('api/Stores/Index')
            .then(response => response.json())
            .then(data => {
                this.setState({ storeList: data, loading: false });
            });

        //this binding is necessary to make "this" work in the callback
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderStoreTable(this.state.storeList);

        return <div>
            <h1>Store</h1>
            <p>This component demostrates fetching Store data from the server.</p>
            <p>
                <Link to="/addStore">Create New</Link>
            </p>
            {contents}
        </div>;
    }

    //Handle Delete request for an store
    handleDelete(id) {
        if (!window.confirm("Do you want to delete store with Id: " + id)) {
            return;
        }
        else {
            fetch('api/Stores/Delete/' + id, {
                method: 'delete'
            }).then(response => response.json())
                .then(data => {
                    console.log(data);
                });
            const newStoreList = this.state.storeList.filter(storeList => {
                return storeList.id !== id;
            });

            this.setState({
                storeList: [...newStoreList]
            });
        }
    }

    handleEdit(id) {
        this.props.history.push("Stores/edit/" + id);
    }

    //return the html table to the render() method
    renderStoreTable(storeList) {
        return <table className="table">
            <thead>
                <tr>
                    <th></th>
                    <th>Store ID</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Actions</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {storeList.map(store =>
                    <tr key={store.id}>
                        <td></td>
                        <td>{store.id}</td>
                        <td>{store.name}</td>
                        <td>{store.address}</td>
                        <td>
                            <Link className="btn btn-success" to={"/store/edit/" + store.id} >Edit</Link>
                        </td>
                        <td>
                            <button type="button" onClick={(e) => this.handleDelete(store.id)} className="btn btn-danger">Delete</button>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>;
    }
}


export class StoreData {
    storeId = 0;
    name = "";
    address = "";
}