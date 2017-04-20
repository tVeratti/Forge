using System;

namespace Forge.Data.Models
{
    public class DefinitionSettingModel
    {
        public long DefinitionId { get; set; }
        public long Id { get; set; }
        public string Value { get; set; }
        public string Name { get; set; }
        public string ControlName { get; set; }
        public int Priority { get; set; }
        public string LifeCycle { get; set; }
        
    }
}
