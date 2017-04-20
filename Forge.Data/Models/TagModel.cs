using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Forge.Data.Models
{
    public class TagModel
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public long CreatedById { get; set; }
        public long ModifiedById { get; set; }
    }
}
