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
    public class StoresController : ControllerBase
    {
        private readonly Kevin_HuangContext _context;

        public StoresController(Kevin_HuangContext context)
        {
            _context = context;
        }

        // GET: api/Stores
        [HttpGet]
        [Route("Index")]
        public async Task<ActionResult<IEnumerable<Store>>> GetStores()
        {
            return await _context.Stores.ToListAsync();
        }

        [HttpGet]
        [Route("Details/{id}")]
        public Store Details(int id)
        {
            try
            {
                Store store = _context.Stores.Find(id);
                return store;
            }
            catch
            {
                throw;
            }
        }

        // GET: api/Stores/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Store>> GetStore(int id)
        {
            var store = await _context.Stores.FindAsync(id);

            if (store == null)
            {
                return NotFound();
            }

            return store;
        }

        // PUT: api/Stores/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut]
        [Route("Edit/{id}")]
        public async Task<IActionResult> PutStore(int id, Store store)
        {
            if (id != store.ID)
            {
                return BadRequest();
            }

            store.ID = id;

            _context.Entry(store).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StoreExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetStore", new { id = store.ID }, store);
            //return NoContent();
        }

        // POST: api/Stores
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        [Route("Create")]
        public async Task<ActionResult<Store>> PostStore(Store store)
        {
            _context.Stores.Add(store);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetStore", new { id = store.ID }, store);
        }

        // DELETE: api/Stores/5
        [HttpDelete("Delete/{id}")]
        //[Route("Delete/{id}")]
        public async Task<ActionResult<Store>> DeleteStore(int id)
        {
            var store = await _context.Stores.FindAsync(id);
            if (store == null)
            {
                return NotFound();
            }

            try {
            _context.Stores.Remove(store);
            await _context.SaveChangesAsync();

            return store; 
            }
            catch
            {
                throw;
            }
        }

        private bool StoreExists(int id)
        {
            return _context.Stores.Any(e => e.ID == id);
        }
    }
}
