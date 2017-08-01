using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;

namespace Forge.Web.Utilities
{
    public static class Helpers
    {
        public static IHtmlString Render(this HtmlHelper helper, string id, string name, object props = null)
        {
            var propsJson = JsonConvert.SerializeObject(props ?? new { });

            return new HtmlString(string.Format(@"
                <script>
                    ReactDOM.render(
                        React.createElement({0}, {1}),
                        document.getElementById('{2}')
                    );
                </script>", name, propsJson, id)
            );
        }
    }
}