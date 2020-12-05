using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Kevin_Huang.Data;
using Kevin_Huang.Models;

namespace Kevin_Huang
{
    public class IndexModel : PageModel
    {
        private readonly Kevin_Huang.Data.Kevin_HuangContext _context;

        public IndexModel(Kevin_Huang.Data.Kevin_HuangContext context)
        {
            _context = context;
        }

        public IList<Customer> Customer { get;set; }

        public async Task OnGetAsync()
        {
            Customer = await _context.Customers.ToListAsync();
        }
    }
}
