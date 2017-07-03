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
            Model.ModifiedById = User.Id;

            if (Model.Id == 0)
            {
                return _context.Rules.Create(Model);
            }
            else
            {
                _context.Rules.Update(Model);
            }

            return Model.Id;
        }

        [HttpPost]
        public long SaveTag(TagModel Model)
        {

            if (Model.Id == 0)
            {
                // INSERT
                Model.CreatedById = User.Id;
                return _context.Tags.Create(Model);
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
        public long SaveGroup(GroupModel Model)
        {
            if (Model.Id == 0)
            {
                // INSERT
                return _context.Core.CreateGroup(Model, User.Id);
            }
            else
            {
                // UPDATE
                _context.Core.UpdateGroup(Model, User.Id);
            }

            return Model.Id;
        }

        [HttpPost]
        public void Save(CoreModel Model)
        {
            _context.Core.Update(Model, User.Id);
        }
    }
}