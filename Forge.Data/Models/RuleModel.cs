using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Forge.Data.Models
{
    public class RuleModel
    {
        public string Category => Categories.RULES;

        public long SettingId { get; set; }
        public long TagId { get; set; }
        public string SettingName { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
        public string LifeCycle { get; set; }
        public long CreatedById { get; set; }
        public DateTime CreatedDate { get; set; }
        public long ModifiedById { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
