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
        public long SaveRule(RuleModel Model, long GameId)
        {
            Model.ModifiedById = User.Id;
            _context.Rules.Create(Model);
            return 0;
        }

        [HttpPost]
        public long SaveTag(TagModel Model, long GameId)
        {
            if (Model.Id == 0)
            {
                // INSERT
                Model.CreatedById = User.Id;
                return _context.Tags.Create(Model, GameId);
            }
            else
            {
                // UPDATE
                Model.ModifiedById = User.Id;
                _context.Tags.Update(Model);
            }

            return Model.Id;
        }

        [HttpPost]
        public long SaveDefinition(DefinitionModel Model, long GameId)
        {
            if (Model.Id == 0)
            {
                // INSERT
                Model.CreatedById = User.Id;
                return _context.Definitions.Create(Model, GameId);
            }
            else
            {
                // UPDATE
                Model.ModifiedById = User.Id;
                _context.Definitions.Update(Model);
            }

            return Model.Id;
        }
    }
}