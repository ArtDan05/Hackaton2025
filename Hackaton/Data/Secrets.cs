using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hackaton.Data
{
    public class Secrets
    {
        [Key]
        public string ID { get; set; }
        public string Name { get; set; }
        public string LoginEncrypted { get; set; }
        public string PasswordEncrypted { get; set; }
        public string Host { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
       
    }
}
