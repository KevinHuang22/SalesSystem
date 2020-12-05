using Kevin_Huang.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace Kevin_Huang.Data
{
    public class CustomerDataAccessLayer
    {
        Kevin_HuangContext db = new Kevin_HuangContext();

        public IEnumerable<Customer> GetCustomers()
        {
            try
            {
                return db.Customers.ToList();
            }
            catch
            {
                throw;
            }
        }

        //To Add new Customer record
        public int AddCustomer(Customer customer)
        {
            try
            {
                db.Customers.Add(customer);
                db.SaveChanges();
                return 1;
            }
            catch
            {
                throw;
            }
        }

        //To Update the records of a particular customer
        public int UpdateCustomer(Customer customer)
        {
            try
            {
                db.Entry(customer).State = EntityState.Modified;
                db.SaveChanges();
                return 1;
            }
            catch
            {
                throw;
            }
        }

        //Get the details of a particular customer
        public Customer GetCustomerDetail(int id)
        {
            try
            {
                Customer customer = db.Customers.Find(id);
                return customer;
            }
            catch
            {
                throw;
            }
        }

        //To Delete the record of a paricular customer
        public int DeleteCustomer(int id)
        {
            try
            {
                Customer customer = db.Customers.Find(id);
                db.Customers.Remove(customer);
                db.SaveChanges();
                return 1;
            }
            catch
            {
                throw;
            }
        }
    }
}
