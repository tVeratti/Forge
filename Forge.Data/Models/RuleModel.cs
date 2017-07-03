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

        public long Id { get; set; }
        public long TagId { get; set; }
        public long SettingId { get; set; }
        public long GameId { get; set; }
        public string SettingName { get; set; }
        public string Name { get; set; }
        public string LifeCycle { get; set; }
        public long ModifiedById { get; set; }
        public DateTime ModifiedDate { get; set; }

        public IEnumerable<IdKeyValuePairModel> Keys { get; set; }

        public static explicit operator TableRuleModel(RuleModel t)
        {
            return new TableRuleModel()
            {
                Id = t.Id,
                SettingId = t.SettingId,
                TagId = t.TagId,
                Name = t.Name
            };
        }
    }

    public class TableRuleModel
    {
        public long Id { get; set; }
        public long SettingId { get; set; }
        public long TagId { get; set; }
        public string Name { get; set; }
    }
}
