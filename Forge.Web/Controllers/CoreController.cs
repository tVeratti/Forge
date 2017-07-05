using Forge.Data;
using Forge.Data.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Forge.Web.Controllers
{
    public class CoreController : BaseController
    {
        private readonly DataContext _context;

        public CoreController(DataContext context) { this._context = context; }

        [HttpGet]
        public string Get(long id)
        {
            var result = _context.Games.Designer(id, User.Id);
            var resultJson = JsonConvert.SerializeObject(result);

            return resultJson;
        }

        [HttpPost]
        public long SaveRule(RuleModel Model)
        {
            if (Model.Id == 0)
            {
                return _context.Rules.Create(Model, User.Id);
            }
            else
            {
                _context.Rules.Update(Model, User.Id);
            }

            return Model.Id;
        }

        [HttpPost]
        public long SaveTag(TagModel Model)
        {

            if (Model.Id == 0)
            {
                // INSERT
                return _context.Tags.Create(Model, User.Id);
            }
            else
            {
                // UPDATE
                _context.Tags.Update(Model, User.Id);
            }

            return Model.Id;
        }

        [HttpPost]
        public long SaveDefinition(DefinitionModel Model)
        {
            if (Model.Id == 0)
            {
                // INSERT
                return _context.Definitions.Create(Model, User.Id);
            }
            else
            {
                // UPDATE
                _context.Definitions.Update(Model, User.Id);
            }

            return Model.Id;
        }

        [HttpPost]
        public JsonResult SaveGroups(IEnumerable<GroupModel> Groups, long GameId)
        {
            var groups = _context.Core.UpdateGroups(Groups, GameId, User.Id);
            return Json(groups, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public void SaveGame(GameModel Model)
        {
            Model.ModifiedById = User.Id;
            _context.Games.Update(Model);
        }

        [HttpPost]
        public void Save(CoreModel Model)
        {
            _context.Core.Update(Model, User.Id);
        }

        [HttpPost]
        public void DeleteTag(long Id)
        {
            _context.Tags.Delete(Id, User.Id);
        }

        [HttpPost]
        public void DeleteRule(long Id)
        {
            _context.Rules.Delete(Id, User.Id);
        }

        [HttpPost]
        public void DeleteDefinition(long Id)
        {
            _context.Definitions.Delete(Id, User.Id);
        }
    }
}