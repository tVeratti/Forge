using System;
using System.Collections.Generic;

namespace Forge.Data.Models
{
    public class DefinitionModel : TableDefinitionModel
    {
        public string Category => Categories.DEFINITIONS;

        public long CreatedById { get; set; }
        public long ModifiedById { get; set; }
        public DateTime ModifiedDate { get; set; }

        public string ControlName { get; set; }

        public IEnumerable<DefinitionTagModel> Tags { get; set; }
        public IEnumerable<DefinitionSettingModel> Settings { get; set; }
        public IEnumerable<DefinitionRuleModel> Rules { get; set; }

        public TableDefinitionModel Flatten()
        {
            return new TableDefinitionModel()
            {
                Id = this.Id,
                Name = this.Name,
                GroupId = this.GroupId,
                ControlId = this.ControlId
            };
        }
    }

    public class TableDefinitionModel
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public long GroupId { get; set; }
        public int ControlId { get; set; }

    }
}
