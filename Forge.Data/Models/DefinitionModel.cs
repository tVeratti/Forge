using System.Collections.Generic;

namespace Forge.Data.Models
{
    public class DefinitionModel
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public int ControlId { get; set; }
        public long GroupId { get; set; }
        public long CreatedById { get; set; }
        public long ModifiedById { get; set; }

        public IEnumerable<DefinitionTagModel> Tags { get; set; }
        public IEnumerable<DefinitionSettingModel> Settings { get; set; }
    }
}
