using System;
using System.Collections.Generic;

namespace Forge.Data.Models
{
    public class DefinitionSettingModel
    {
        public long Id { get; set; }
        public long DefinitionId { get; set; }
        public long SettingId { get; set; }
        public string Value { get; set; }
        public string Name { get; set; }
        public string ControlName { get; set; }
        public int Priority { get; set; }
        public string LifeCycle { get; set; }

        public Dictionary<string, IdKeyValuePairModel> Keys { get; set; }

        public static explicit operator TableDefinitionSettingModel(DefinitionSettingModel s)
        {
            return new TableDefinitionSettingModel()
            {
                Id = s.Id,
                DefinitionId = s.DefinitionId,
                SettingId = s.SettingId,
                Priority = s.Priority
            };
        }
    }

    public class TableDefinitionSettingModel
    {
        public long Id { get; set; }
        public long DefinitionId { get; set; }
        public long SettingId { get; set; }
        public int Priority { get; set; }
    }
}
