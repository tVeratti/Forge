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
        public long ModifiedById { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int EditTypeId { get; set; }
        public int ViewTypeId { get; set; }
        public int GenreId { get; set; }

        public string CreatedByUserName { get; set; }
        public string ModifiedByUserName { get; set; }
        public bool IsLocked { get; set; }

    }
}
