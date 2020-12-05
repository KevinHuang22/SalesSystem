import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Customer } from './components/Customer';
import { AddCustomer } from './components/AddCustomer';
import { ShowCustomer } from './components/ShowCustomer';
import { Product } from './components/Product';
import { AddProduct } from './components/AddProduct';
import { Store } from './components/Store';
import { AddStore } from './components/AddStore';
import { Sales } from './components/Sales';
import { AddSales } from './components/AddSales';

import './custom.css';

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
            <Route path='/fetchcustomer' component={Customer} />
            <Route path='/addCustomer' component={AddCustomer} />
            <Route path='/customer/edit/:ctmid' component={AddCustomer} />
            <Route path='/showcustomer/:ctmid' component={ShowCustomer} />
            <Route path='/fetchproduct' component={Product} />
            <Route path='/addProduct' component={AddProduct} />
            <Route path='/product/edit/:prdtid' component={AddProduct} />
            <Route path='/fetchstore' component={Store} />
            <Route path='/addStore' component={AddStore} />
            <Route path='/store/edit/:storeid' component={AddStore} />
            <Route path='/fetchsales' component={Sales} />
            <Route path='/addSales' component={AddSales} />
            <Route path='/sales/edit/:salesid' component={AddSales} />
        <Route path='/fetch-data' component={FetchData} />
      </Layout>
    );
  }
}
