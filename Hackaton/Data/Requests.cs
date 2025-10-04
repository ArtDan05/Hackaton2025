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
        public string ID { get; set; }
        public string Login { get; set; }
        public string Resource { get; set; }
        public string Reason { get; set; }
        public string Status { get; set; }
        public DateOnly DataTime { get; set; }
    }
}
