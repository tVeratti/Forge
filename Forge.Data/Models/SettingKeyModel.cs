using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Forge.Data.Models
{
    public class SettingKeyModel
    {
        public long SettingId { get; set; }
        public string Key { get; set; }
        public string ControlName { get; set; }
    }
}
