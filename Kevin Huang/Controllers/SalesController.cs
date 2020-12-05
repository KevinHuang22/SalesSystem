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
    public class SalesController : ControllerBase
    {
        private readonly Kevin_HuangContext _context;

        public SalesController(Kevin_HuangContext context)
        {
            _context = context;
        }

        // GET: api/Sales
        [HttpGet]
        [Route("Index")]
        public async Task<ActionResult<IEnumerable<Sales>>> GetSales()
        {
            var sales = await _context.Sales.Include(s => s.Customer)
                .Include(s => s.Product)
                .Include(s => s.Store)
                .AsNoTracking()
                .ToListAsync();
            return sales;
        }

        // GET: api/Sales/5
        [HttpGet]
        [Route("Details/{id}")]
        public Sales GetSales(int id)
        {
            try
            {
                Sales sales = _context.Sales.Find(id);
                return sales;
            }
            catch
            {
                throw;
            }
        }

        // PUT: api/Sales/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut]
        [Route("Edit/{id}")]
        public async Task<IActionResult> PutSales(int id, Sales sales)
        {
            if (id != sales.ID)
            {
                return BadRequest();
            }

            _context.Entry(sales).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SalesExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return CreatedAtAction("GetSales", new { id = sales.ID }, sales);
            //return NoContent();
        }

        // POST: api/Sales
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        [Route("Create")]
        public async Task<ActionResult<Sales>> PostSales(Sales sales)
        {
            _context.Sales.Add(sales);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSales", new { id = sales.ID }, sales);
        }

        // DELETE: api/Sales/5
        [HttpDelete]
        [Route("Delete/{id}")]
        public async Task<ActionResult<Sales>> DeleteSales(int id)
        {
            var sales = await _context.Sales.FindAsync(id);
            if (sales == null)
            {
                return NotFound();
            }

            try
            {
                _context.Sales.Remove(sales);
                await _context.SaveChangesAsync();

                return sales;
            }
            catch
            {
                throw;
            }

        }

        [HttpGet]
        [Route("GetCustomerList")]
        public IEnumerable<Customer> CustomerDetails()
        {
            List<Customer> lstCustomer = new List<Customer>();
            lstCustomer = (from CustomerName in _context.Customers select CustomerName).ToList();

            return lstCustomer;
        }

        [HttpGet]
        [Route("GetProductList")]
        public IEnumerable<Product> ProductDetails()
        {
            List<Product> lstProduct = new List<Product>();
            lstProduct = (from ProductName in _context.Products select ProductName).ToList();

            return lstProduct;
        }

        [HttpGet]
        [Route("GetStoreList")]
        public IEnumerable<Store> StoreDetails()
        {
            List<Store> lstStore = new List<Store>();
            lstStore = (from StoreName in _context.Stores select StoreName).ToList();

            return lstStore;
        }

        private bool SalesExists(int id)
        {
            return _context.Sales.Any(e => e.ID == id);
        }
    }
}
