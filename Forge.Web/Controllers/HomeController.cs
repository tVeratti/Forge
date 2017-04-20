using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

using Forge.Data;
using Forge.Data.Models;
using Newtonsoft.Json;

namespace Forge.Web.Controllers
{
    public class HomeController : BaseController
    {
        private readonly DataContext _context;

        public HomeController(DataContext context) { this._context = context; }

        #region MVC
        // ========================================================
        public ActionResult Index()
        {
            return View();
        }

        #endregion


        #region API
        // ========================================================

        #endregion
    }
}
