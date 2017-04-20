using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Forge.Data.Models
{
    public class GameModel
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public DateTime CreatedDate { get; set; }
        public long CreatedById { get; set; }
        public int EditTypeId { get; set; }
        public int ViewTypeId { get; set; }

        public string CreatedByUserName { get; set; }
        public bool IsLocked { get; set; }

    }
}
