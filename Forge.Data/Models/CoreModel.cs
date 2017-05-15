using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Forge.Data.Models
{
    public class CoreModel
    {
        public GameModel Game { get; set; }
        public IEnumerable<RuleModel> Rules { get; set; }
        public IEnumerable<DefinitionModel> Definitions { get; set; }
        public IEnumerable<SettingModel> Settings { get; set; }
        public IEnumerable<TagModel> Tags { get; set; }
        public IEnumerable<ControlModel> Controls { get; set; }
        public IEnumerable<GroupModel> Groups { get; set; }
    }
}
