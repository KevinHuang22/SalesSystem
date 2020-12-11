import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

export class Sales extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true, customerList: [], salesList: [], productList: [], storeList: [],
            isDisplayModal: false, action: "", salesId: 0, salesData: {}
        };

        fetch('api/Sales/Index')
            .then(response => response.json())
            .then(data => {
                this.setState({ salesList: data, loading: false });
            });

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

        //this binding is neccessary to make "this" work in the callback
        this.handleSave = this.handleSave.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.onDisplayOverlaps = this.onDisplayOverlaps.bind(this);
        this.onCloseOverlaps = this.onCloseOverlaps.bind(this);
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderSalesTable(this.state.salesList);

        return <div>
            <h1>Sales</h1>
            {contents}
        </div>;
    }

    //Handle save a new or edited sales
    handleSave(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        let ID = this.state.salesId;

        //PUT request for Edit sales.
        if (ID) {
            fetch('api/Sales/Edit/' + ID, {
                method: 'PUT',
                body: data,
            }).then((response) => response.json())
                .then(data => {
                    console.log(data);
                    fetch('api/Sales/Index')
                        .then(response => response.json())
                        .then(data => {
                            console.log(data);
                            let newList = data;
                            this.setState({ salesList: newList })
                        });
                });
        }

        //POST request for Add sales
        else {
            //console.log("Add sales method is trigered")
            fetch('api/Sales/Create', {
                method: 'POST',
                body: data,
            }).then((response) => response.json())
                .then(data => {
                    console.log(data);
                    fetch('api/Sales/Index')
                        .then(response => response.json())
                        .then(data => {
                            console.log(data);
                            let newList = data;
                            this.setState({ salesList: newList })
                        });
                });
        }

        this.onCloseOverlaps();
    }

    //Handle Delete request for an sales
    handleDelete(id) {
        fetch('api/Sales/Delete/' + id, {
            method: 'delete'
        }).then(response => response.json())
            .then(data => {
                console.log(data);
            });
        const newSalesList = this.state.salesList.filter(salesList => {
            return salesList.id !== id;
        });

        this.setState({
            salesList: [...newSalesList]
        });    
    }

    //Handle modal display
    onDisplayOverlaps(action, id) {
        //this will set state for Edit sales
        if (id > 0) {
            fetch('api/Sales/Details/' + id)
                .then(response => response.json())
                .then(data => {
                    this.setState({ salesData: data });
                });
        }
        this.setState({
            isDisplayModal: true, action: action, salesId: id
        });
    }

    //Handle modal close
    onCloseOverlaps() {
        this.setState({ isDisplayModal: false, salesId: 0, salesData: {} });
    }

    //returns the html table to the render() method.
    renderSalesTable(salesList) {

        let modalContent;

        switch (this.state.action) {

            case "new":
                let today = new Date();
                let dateSold = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();
                modalContent =
                    <Form onSubmit={this.handleSave}>
                        <Modal.Header closeButton>
                            <Modal.Title>"New Sales"</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <Form.Group controlId="salesId">
                                <Form.Control type="hidden" name="salesId" />
                            </Form.Group>

                            <Form.Row>
                                <Col xs={4}>
                                    <Form.Group controlId="dateSold">
                                        <Form.Label>Date sold</Form.Label>
                                    <Form.Control type="text" name="DateSold" value={dateSold} readOnly/>
                                    </Form.Group>
                                </Col>
                            </Form.Row>

                            <Form.Group controlId="CustomerId">
                                <Form.Label>Customer</Form.Label>
                                <Form.Control as="select" name="customerId">
                                    <option></option>
                                    {this.state.customerList.map(customer =>
                                        <option key={customer.id} value={customer.id}>{customer.name}</option>
                                    )}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="ProductId">
                                <Form.Label>Product</Form.Label>
                                <Form.Control as="select" name="productId">
                                    <option></option>
                                    {this.state.productList.map(product =>
                                        <option key={product.id} value={product.id}>{product.name}</option>
                                    )}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="StoreId">
                                <Form.Label>Store</Form.Label>
                                <Form.Control as="select" name="storeId">
                                    <option></option>
                                    {this.state.storeList.map(store =>
                                        <option key={store.id} value={store.id}>{store.name}</option>
                                    )}
                                </Form.Control>
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
                            <Modal.Title>"Edit Sales"</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <Form.Group controlId="ID">
                                <Form.Control type="hidden" name="ID" value={this.state.salesId} />
                            </Form.Group>

                            <Form.Row>
                                <Col xs={4}>
                                    <Form.Group controlId="dateSold">
                                        <Form.Label>Date sold</Form.Label>
                                        <Form.Control type="text" name="DateSold" value={this.state.salesData.dateSold} readOnly />
                                    </Form.Group>
                                </Col>
                            </Form.Row>

                            <Form.Group controlId="CustomerId">
                                <Form.Label>Customer</Form.Label>
                                <Form.Control as="select" name="customerId">
                                    <option key={this.state.salesData.customerId}></option>
                                    {this.state.customerList.map(customer =>
                                        <option key={customer.id} value={customer.id}>{customer.name}</option>
                                    )}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="ProductId">
                                <Form.Label>Product</Form.Label>
                                <Form.Control as="select" name="productId">
                                    <option key={this.state.salesData.productId}></option>
                                    {this.state.productList.map(product =>
                                        <option key={product.id} value={product.id}>{product.name}</option>
                                    )}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="StoreId">
                                <Form.Label>Store</Form.Label>
                                <Form.Control as="select" name="storeId">
                                    <option key={this.state.salesData.storeId}></option>
                                    {this.state.storeList.map(store =>
                                        <option key={store.id} value={store.id}>{store.name}</option>
                                    )}
                                </Form.Control>
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
                            <Modal.Title>Delete Sales</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <p>Are you sure?</p>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.onCloseOverlaps}>Cancel</Button>
                            <Button variant="danger" onClick={() => this.handleDelete(this.state.salesId)} >Delete</Button>
                        </Modal.Footer>
                    </div>;
                break;
            default: break;
        }

        let salesModal = () => {
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
                        onClick={() => this.onDisplayOverlaps("new")}>
                        New Sales
                    </Button>
                </div>
                {salesModal()}
                <br />
                <table className="table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Customer</th>
                        <th>Product</th>
                        <th>Store</th>
                        <th>Actions</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {salesList.map(sales =>
                        <tr key={sales.id}>
                            <td></td>
                            <td>{sales.customer.name}</td>
                            <td>{sales.product.name}</td>
                            <td>{sales.store.name}</td>
                            <td>
                                <Button variant="warning" onClick={() => this.onDisplayOverlaps("edit", sales.id)} >Edit</Button>
                            </td>
                            <td>
                                <Button variant="danger" onClick={() => this.onDisplayOverlaps("delete", sales.id)} >Delete</Button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
        )
    }
}