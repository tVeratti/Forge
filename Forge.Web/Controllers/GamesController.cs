using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

using Forge.Data;
using Forge.Data.Models;
using Newtonsoft.Json;

namespace Forge.Web.Controllers
{
    public class GamesController : BaseController
    {
        private readonly DataContext _context;

        public GamesController(DataContext context) { this._context = context; }

        #region MVC
        // ========================================================
        [HttpGet]
        public ActionResult Index()
        {
            var games = _context.Games.Read(User.Id);
            return View(games);
        }

        #endregion


        #region API
        // ========================================================

        [HttpPost]
        public string GetGames()
        {
            var result = _context.Games.Read(User.Id);
            var resultJson = JsonConvert.SerializeObject(result);

            return resultJson;
        }

        [HttpPost]
        public string CreateGame(string Name)
        {

            var result = _context.Games.Create(Name, User.Id);
            var resultJson = JsonConvert.SerializeObject(result);

            return resultJson;
        }

        [HttpPost]
        public void DeleteGame(long Id)
        {
            _context.Games.Delete(Id);
        }

        #endregion
    }
}
