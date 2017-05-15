using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Forge.Web.Controllers
{
    public class DesignerController : Controller
    {
        // GET: Designer
        public ActionResult Index(long id)
        {
            return View(id);
        }
    }
}