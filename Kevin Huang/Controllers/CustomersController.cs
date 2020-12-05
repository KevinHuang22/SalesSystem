using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Kevin_Huang.Data;
using Kevin_Huang.Models;

namespace Kevin_Huang.Controllers
{
    [Route("api/[controller]")]
    //[ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly Kevin_HuangContext _context;

        public CustomersController(Kevin_HuangContext context)
        {
            _context = context;
        }

        // GET: api/Customers
        [HttpGet]
        [Route("Index")]
        public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
        {
            return await _context.Customers.ToListAsync();
        }

        [HttpGet]
        [Route("Details/{id}")]
        public Customer Details(int id)
        {
            try
            {
                Customer customer = _context.Customers.Find(id);
                return customer;
            }
            catch
            {
                throw;
            }
        }


        // PUT: api/Customers/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut]
        [Route("Edit/{id}")]
        public async Task<IActionResult> PutCustomer(int id, Customer customer)
        {
            if (id != customer.ID)
            {
                return BadRequest();
            }

            customer.ID = id;

            _context.Entry(customer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomerExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetCustomer", new { id = customer.ID }, customer);
            //return NoContent();
        }

        // POST: api/Customers
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        [Route("Create")]
        public async Task<ActionResult<Customer>> PostCustomer(Customer customer)
        {
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCustomer", new { id = customer.ID }, customer);
        }

        // DELETE: api/Customers/5
        [HttpDelete]
        [Route("Delete/{id}")]
        public async Task<ActionResult<Customer>> DeleteCustomer(int id)
        {
           var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                return NotFound();
            }

            try { 
                _context.Customers.Remove(customer);
                await _context.SaveChangesAsync();

                //return RedirectToAction("GetCustomers");
                return customer;
            }
            catch 
            {
                throw;
            }

        }

        private bool CustomerExists(int id)
        {
            return _context.Customers.Any(e => e.ID == id);
        }
    }
}
