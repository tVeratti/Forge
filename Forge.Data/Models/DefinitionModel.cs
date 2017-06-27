using System;
using System.Collections.Generic;
using System.Linq;

namespace Forge.Data.Models
{
    public class DefinitionModel
    {
        public string Category => Categories.DEFINITIONS;

        public long Id { get; set; }
        public string Name { get; set; }
        public long GroupId { get; set; }
        public int ControlId { get; set; }
        public string ControlName { get; set; }
        public long ModifiedById { get; set; }
        public DateTime ModifiedDate { get; set; }

        public IEnumerable<DefinitionTagModel> Tags { get; set; }
        public IEnumerable<DefinitionSettingModel> Settings { get; set; }
        public IEnumerable<DefinitionRuleModel> Rules { get; set; }

        public static explicit operator TableDefinitionModel(DefinitionModel d)
        {
            return new TableDefinitionModel()
            {
                Id = d.Id,
                Name = d.Name,
                GroupId = d.GroupId,
                ControlId = d.ControlId
            };
        }

        public IEnumerable<IdKeyValuePairModel> GetSettingsValues()
        {
            return Settings?.SelectMany(s => s.Values ?? new List<IdKeyValuePairModel>()) ?? new List<IdKeyValuePairModel>();
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
