using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hackaton.Data
{
    public class Requests
    {
        [Key]
        public int ID { get; set; }
        public string Resource { get; set; }
        public string Reason { get; set; }
        public string DataTime { get; set; }
    }
}
