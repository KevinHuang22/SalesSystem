import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export class Customer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customerList: [], loading: true, isDisplayModal: false, action: "", customerId: 0, customerData: {}
        };
        fetch('api/Customers/Index')
            .then(response => response.json())
            .then(data => {
                this.setState({ customerList: data, loading: false });
            });

        //this binding is neccessary to make "this" work in the callback
        this.handleSave = this.handleSave.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.onDisplayOverlaps = this.onDisplayOverlaps.bind(this);
        this.onCloseOverlaps = this.onCloseOverlaps.bind(this);
    }


    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderCustomerTable(this.state.customerList);

        return <div>
            <h1>Customers</h1>
            {contents}
        </div>;
    }

    //Handle save a new or edited customer
    handleSave(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        let ID = this.state.customerId;

        //PUT request for Edit customer.
        if (ID) {
            fetch('api/Customers/Edit/' + ID, {
                method: 'PUT',
                body: data,
            }).then((response) => response.json())
                .then(data => {
                    console.log(data);
                    fetch('api/Customers/Index')
                        .then(response => response.json())
                        .then(data => {
                            console.log(data);
                            let newList = data;
                            this.setState({ customerList: newList })
                        });
                });
        }

        //POST request for Add customer
        else {
            //console.log("Add customer method is trigered")
            fetch('api/Customers/Create', {
                method: 'POST',
                body: data,
            }).then((response) => response.json())
              .then(data => {
                  console.log(data);
                  fetch('api/Customers/Index')
                      .then(response => response.json())
                      .then(data => {
                          console.log(data);
                          let newList = data;
                          this.setState({ customerList: newList })
                      });
              });
        }
        
        this.onCloseOverlaps();
    }


    //Handle Delete request for an customer
    handleDelete(id) {
        fetch('api/Customers/Delete/' + id, {
            method: 'delete'
        }).then(response => response.json())
            .then(data => {
                console.log(data);
            });
        const newCustomerList = this.state.customerList.filter(customerList => {
            return customerList.id !== id;
        });

        this.setState({
            customerList: [...newCustomerList]
        });

        this.onCloseOverlaps();
    }

    //Handle modal display
    onDisplayOverlaps(action, id) {
        //this will set state for Edit customer
        if (id > 0) {
            fetch('api/Customers/Details/' + id)
                .then(response => response.json())
                .then(data => {
                    this.setState({ customerData: data });
                });
        }
        this.setState({
            isDisplayModal: true, action: action, customerId: id
        });
    }

    //Handle modal close
    onCloseOverlaps() {
        this.setState({ isDisplayModal: false, customerId: 0, customerData: {} });
    }


    //returns the html table to the render() method.
    renderCustomerTable(customerList) {

        let modalContent;

        switch (this.state.action) {

            case "new":
                modalContent =
                    <Form onSubmit={this.handleSave}>
                        <Modal.Header closeButton>
                            <Modal.Title>"New Customer"</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <Form.Group controlId="ID">
                                <Form.Control type="hidden" name="ID" />
                            </Form.Group>

                            <Form.Group controlId="Name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" name="Name" />
                            </Form.Group>

                            <Form.Group controlId="Address">
                                <Form.Label>Address</Form.Label>
                                <Form.Control type="text" name="Address" />
                            </Form.Group>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="dark" onClick={this.onCloseOverlaps}>Cancel</Button>{' '}
                            <Button variant="outline-success" type="submit">Create</Button>
                        </Modal.Footer>
                    </Form>;
                break;

            case "edit":
                modalContent =
                    <Form onSubmit={this.handleSave}>
                        <Modal.Header closeButton>
                            <Modal.Title>"Edit Customer"</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <Form.Group controlId="ID">
                                <Form.Control type="hidden" name="ID" value={this.state.customerId} />
                            </Form.Group>

                            <Form.Group controlId="Name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" name="Name" defaultValue={this.state.customerData.name} />
                            </Form.Group>

                            <Form.Group controlId="Address">
                            <Form.Label>Address</Form.Label>
                            <Form.Control type="text" name="Address" defaultValue={this.state.customerData.address} />
                            </Form.Group>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="dark" onClick={this.onCloseOverlaps}>Cancel</Button>{' '}
                            <Button variant="success" type="submit">Edit</Button>
                        </Modal.Footer>
                    </Form>;
                break;

            case "delete":
                modalContent =
                    <div>
                        <Modal.Header closeButton>
                            <Modal.Title>Delete Customer</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <p>Are you sure?</p>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.onCloseOverlaps}>Cancel</Button>
                            <Button variant="danger" onClick={() => this.handleDelete(this.state.customerId)} >Delete</Button>
                        </Modal.Footer>
                    </div>;
                break;
            default : break;
        }
        
        let customerModal = () => {
            if (this.state.isDisplayModal) {
                return (
                    <div>
                        <div className="static-modal" id="static-modal">
                            <Modal
                                show={this.state.isDisplayModal}
                                onHide={this.onCloseOverlaps}
                                backdrop="static"
                                centered
                            >
                                {modalContent}
                            </Modal>
                        </div>
                    </div>
                );
            }
        }

        return (
            <div>
                <div>
                    <Button
                    className="primary"
                    onClick={() =>this.onDisplayOverlaps("new")}>
                        New Customer
                    </Button>    
                </div>
                {customerModal()}
                <br />
                <table className="table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Actions</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {customerList.map(customer =>
                        <tr key={customer.id}>
                            <td></td>
                            <td>
                                {customer.name}
                            </td>
                            <td>{customer.address}</td>
                            <td>
                                <Button variant="warning" onClick={() => this.onDisplayOverlaps("edit", customer.id)} >Edit</Button>
                            </td>
                            <td>
                                <Button variant="danger" onClick={() => this.onDisplayOverlaps("delete", customer.id)} >Delete</Button>
                            </td>
                        </tr>
                    )}
                </tbody>
                </table>
            </div>      
            )
        }
    }



