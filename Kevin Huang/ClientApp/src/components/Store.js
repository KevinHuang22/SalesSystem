import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export class Store extends Component {
    constructor(props) {
        super(props);
        this.state = {
            storeList: [], loading: true, isDisplayModal: false, action: "", storeId: 0, storeData: {}
        };
        fetch('api/Stores/Index')
            .then(response => response.json())
            .then(data => {
                this.setState({ storeList: data, loading: false });
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
            : this.renderStoreTable(this.state.storeList);

        return <div>
            <h1>Stores</h1>
            {contents}
        </div>;
    }

    //Handle save a new or edited store
    handleSave(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        let ID = this.state.storeId;

        //PUT request for Edit store.
        if (ID) {
            fetch('api/Stores/Edit/' + ID, {
                method: 'PUT',
                body: data,
            }).then((response) => response.json())
                .then(data => {
                    console.log(data);
                    fetch('api/Stores/Index')
                        .then(response => response.json())
                        .then(data => {
                            console.log(data);
                            let newList = data;
                            this.setState({ storeList: newList })
                        });
                });
        }

        //POST request for Add store
        else {
            //console.log("Add store method is trigered")
            fetch('api/Stores/Create', {
                method: 'POST',
                body: data,
            }).then((response) => response.json())
                .then(data => {
                    console.log(data);
                    fetch('api/Stores/Index')
                        .then(response => response.json())
                        .then(data => {
                            console.log(data);
                            let newList = data;
                            this.setState({ storeList: newList })
                        });
                });
        }

        this.onCloseOverlaps();
    }


    //Handle Delete request for an store
    handleDelete(id) {
        fetch('api/Stores/Delete/' + id, {
            method: 'delete'
        }).then(response => response.json())
            .then(data => {
                console.log(data);
            });
        const newstoreList = this.state.storeList.filter(storeList => {
            return storeList.id !== id;
        });

        this.setState({
            storeList: [...newstoreList]
        });

        this.onCloseOverlaps();
    }

    //Handle modal display
    onDisplayOverlaps(action, id) {
        //this will set state for Edit store
        if (id > 0) {
            fetch('api/Stores/Details/' + id)
                .then(response => response.json())
                .then(data => {
                    this.setState({ storeData: data });
                });
        }
        this.setState({
            isDisplayModal: true, action: action, storeId: id
        });
    }

    //Handle modal close
    onCloseOverlaps() {
        this.setState({ isDisplayModal: false, storeId: 0, storeData: {} });
    }


    //returns the html table to the render() method.
    renderStoreTable(storeList) {

        let modalContent;

        switch (this.state.action) {

            case "new":
                modalContent =
                    <Form onSubmit={this.handleSave}>
                        <Modal.Header closeButton>
                            <Modal.Title>"New Store"</Modal.Title>
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
                            <Modal.Title>"Edit Store"</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <Form.Group controlId="ID">
                                <Form.Control type="hidden" name="ID" value={this.state.storeId} />
                            </Form.Group>

                            <Form.Group controlId="Name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" name="Name" defaultValue={this.state.storeData.name} />
                            </Form.Group>

                            <Form.Group controlId="Address">
                                <Form.Label>Address</Form.Label>
                                <Form.Control type="text" name="Address" defaultValue={this.state.storeData.address} />
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
                            <Modal.Title>Delete Store</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <p>Are you sure?</p>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.onCloseOverlaps}>Cancel</Button>
                            <Button variant="danger" onClick={() => this.handleDelete(this.state.storeId)} >Delete</Button>
                        </Modal.Footer>
                    </div>;
                break;
            default: break;
        }

        let storeModal = () => {
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
                        New Store
                    </Button>
                </div>
                {storeModal()}
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
                        {storeList.map(store =>
                            <tr key={store.id}>
                                <td></td>
                                <td>
                                    {store.name}
                                </td>
                                <td>{store.address}</td>
                                <td>
                                    <Button variant="warning" onClick={() => this.onDisplayOverlaps("edit", store.id)} >Edit</Button>
                                </td>
                                <td>
                                    <Button variant="danger" onClick={() => this.onDisplayOverlaps("delete", store.id)} >Delete</Button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
}



