using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Forge.Data.Models
{
    public class LookupValues
    {
        public IEnumerable<SettingKeyModel> SettingsKeys { get; set; }
        public IEnumerable<DefinitionTagModel> DefinitionTags { get; set; }
        public IEnumerable<DefinitionSettingModel> DefinitionSettings { get; set; }
        public IEnumerable<IdKeyValuePairModel> DefinitionSettingsValues { get; set; }
    }
}
