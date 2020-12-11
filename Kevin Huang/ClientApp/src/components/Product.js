import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export class Product extends Component {
    constructor(props) {
        super(props);
        this.state = { productList: [], loading: true, isDisplayModal: false, action: "", productId: 0, productData: {} };
        fetch('api/Products/Index')
            .then(response => response.json())
            .then(data => {
                this.setState({ productList: data, loading: false });
            });

        //this.binding is neccessary to make "this" work in the call back
        this.handleSave = this.handleSave.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.onDisplayOverlaps = this.onDisplayOverlaps.bind(this);
        this.onCloseOverlaps = this.onCloseOverlaps.bind(this);
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderProductTable(this.state.productList);

        return <div>
            <h1>Product</h1>
            {contents}
        </div>;
    }

    //Handle save a new or edited product
    handleSave(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        let ID = this.state.productId;

        //PUT request for Edit product.
        if (ID) {
            fetch('api/Products/Edit/' + ID, {
                method: 'PUT',
                body: data,
            }).then((response) => response.json())
                .then(data => {
                    console.log(data);
                    fetch('api/Products/Index')
                        .then(response => response.json())
                        .then(data => {
                            console.log(data);
                            let newList = data;
                            this.setState({ productList: newList })
                        });
                });
        }

        //POST request for Add product
        else {
            //console.log("Add product method is trigered")
            fetch('api/Products/Create', {
                method: 'POST',
                body: data,
            }).then((response) => response.json())
                .then(data => {
                    console.log(data);
                    fetch('api/Products/Index')
                        .then(response => response.json())
                        .then(data => {
                            console.log(data);
                            let newList = data;
                            this.setState({ productList: newList })
                        });
                });
        }

        this.onCloseOverlaps();
    }

    //Handle delete request for an product
    handleDelete(id) {
        fetch("api/Products/Delete/" + id, {
            method: 'delete'
        }).then(response => response.json())
            .then(data => {
                console.log(data);
            })    

        const newProductList = this.state.productList.filter(productList => {
            return productList.id !== id;
        });

        this.setState({
            productList: [...newProductList]
        });

        this.onCloseOverlaps();
    }

    //Handle modal display
    onDisplayOverlaps(action, id) {
        //this will set state for Edit product
        if (id > 0) {
            fetch('api/Products/Details/' + id)
                .then(response => response.json())
                .then(data => {
                    this.setState({ productData: data });
                });
        }
        this.setState({
            isDisplayModal: true, action: action, productId: id
        });
    }

    //Handle modal close
    onCloseOverlaps() {
        this.setState({ isDisplayModal: false, productId: 0, productData: {} });
    }


    //returns the html table to the render() method.
    renderProductTable(productList) {

        let modalContent;

        switch (this.state.action) {

            case "new":
                modalContent =
                    <Form onSubmit={this.handleSave}>
                        <Modal.Header closeButton>
                            <Modal.Title>"New Product"</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <Form.Group controlId="ID">
                                <Form.Control type="hidden" name="ID" />
                            </Form.Group>

                            <Form.Group controlId="Name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" name="Name" />
                            </Form.Group>

                            <Form.Group controlId="Price">
                                <Form.Label>Price</Form.Label>
                                <Form.Control type="text" name="Price" />
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
                                <Form.Control type="hidden" name="ID" value={this.state.productId} />
                            </Form.Group>

                            <Form.Group controlId="Name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" name="Name" defaultValue={this.state.productData.name} />
                            </Form.Group>

                            <Form.Group controlId="Price">
                                <Form.Label>Price</Form.Label>
                                <Form.Control type="text" name="Price" defaultValue={this.state.productData.price} />
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
                            <Modal.Title>Delete Product</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <p>Are you sure?</p>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.onCloseOverlaps}>Cancel</Button>
                            <Button variant="danger" onClick={() => this.handleDelete(this.state.productId)} >Delete</Button>
                        </Modal.Footer>
                    </div>;
                break;
            default: break;
        }

        let productModal = () => {
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
                        New Product
                    </Button>
                </div>
                {productModal()}
                <br /><table className="table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Actions</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {productList.map(product =>
                        <tr key={product.id}>
                            <td></td>
                            <td>{product.name}</td>
                            <td>${product.price}</td>
                            <td>
                                <Button variant="warning" onClick={() => this.onDisplayOverlaps("edit", product.id)} >Edit</Button>
                            </td>
                            <td>
                                <Button variant="danger" onClick={() => this.onDisplayOverlaps("delete", product.id)} >Delete</Button>
                            </td>
                        </tr>
                    )}
                </tbody>
                </table>
            </div>
        )
    }
}

