using System;

namespace Forge.Data.Models
{
    public class DefinitionRuleModel
    {
        public string Id { get { return $"{SettingId}-{TagId}"; } }

        public long DefinitionId { get; set; }
        public long SettingId { get; set; }
        public long TagId { get; set; }
        public string Value { get; set; }
        public string Name { get; set; }
        public int Priority { get; set; }
        public string ControlName { get; set; }
        public string LifeCycle { get; set; }
    }
}
