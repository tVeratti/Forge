﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Forge.Data.Models
{
    public class TagModel
    {
        public string Category => Categories.TAGS;
        public long Id { get; set; }
        public string Name { get; set; }
        public long GameId { get; set; }
        public DateTime ModifiedDate { get; set; }
        public bool IsActive { get; set; }

        public static explicit operator TableTagModel(TagModel t)
        {
            return new TableTagModel()
            {
                Id = t.Id,
                Name = t.Name,
                GameId = t.GameId,
                IsActive = t.IsActive
            };
        }
    }

    public class TableTagModel
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public long GameId { get; set; }
        public bool IsActive { get; set; }
    }
}
