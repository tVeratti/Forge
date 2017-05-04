using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Forge.Web.Controllers
{
    [AllowAnonymous]
    public class TestsController : Controller
    {
        // GET: Tests
        public ActionResult Index()
        {
            return View();
        }
    }
}