using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Forge.Data.Models
{
    public class GroupModel
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public long ParentId { get; set; }
        public int TypeId { get; set; }
        public string Type { get; set; }
        public int Order { get; set; }
        public long GameId { get; set; }

        public static explicit operator TableGroupModel(GroupModel g)
        {
            return new TableGroupModel()
            {
                Id = g.Id,
                Name = g.Name,
                GameId = g.GameId,
                ParentId = g.ParentId,
                TypeId = g.TypeId,
                Order = g.Order
            };
        }
    }

    public class TableGroupModel
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public long GameId { get; set; }
        public long ParentId { get; set; }
        public int TypeId { get; set; }
        public int Order { get; set; }
    }
}
