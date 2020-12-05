using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kevin_Huang.Models
{
    public class Product
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        //public ICollection<Sales> ProductSold { get; set; }
    }
}
