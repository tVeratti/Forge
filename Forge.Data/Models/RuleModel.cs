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

        public static explicit operator TableRuleModel(RuleModel t)
        {
            return new TableRuleModel()
            {
                SettingId = t.SettingId,
                TagId = t.TagId,
                Name = t.Name,
                Value = t.Value
            };
        }
    }

    public class TableRuleModel
    {
        public long SettingId { get; set; }
        public long TagId { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
    }
}
