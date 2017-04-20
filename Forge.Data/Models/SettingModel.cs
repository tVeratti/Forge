using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Forge.Data.Models
{
    public class SettingModel
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Control { get; set; }
        public string LifeCycle { get; set; }
        public int Priority { get; set; }
    }
}
