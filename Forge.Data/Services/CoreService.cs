using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;

using Dapper;

using Forge.Data.Models;
using System.Data.SqlClient;

namespace Forge.Data.Services
{
    public class CoreService
    {
        private readonly IDbConnection _cnx;

        public CoreService(IDbConnection cnx) { this._cnx = cnx; }

        public void Update(CoreModel Model, long userId)
        {
            var spr_name = "[Verspyre].[Update_Core]";

            var definitions = Model.Definitions.Select(d => d as TableDefinitionModel);
            var tags = Model.Tags.Select(t => t as TableTagModel);
            var rules = Model.Rules.Select(flattenRule);
            var groups = Model.Groups.Select(flattenGroup);

            var definitionSettings = Model.Definitions.SelectMany(flattenDefinitionSetting);

            var spr_prms = new
            {
                ModifiedById = userId,

                // Game
                Name = Model.Game.Name,
                GenreId = Model.Game.GenreId,

                // DataTables
                Tags = tags.ToDataTable(),
                Rules = rules.ToDataTable(),
                Definitions = definitions.ToDataTable(),
                Groups = groups.ToDataTable(),

                // LookUps

            };

            _cnx.Execute(spr_name, spr_prms, commandType: CommandType.StoredProcedure);
        }

        

        private object flattenTag(TagModel tag)
        {
            return new
            {
                tag.Id,
                tag.Name
            };
        }

        private object flattenRule(RuleModel rule)
        {
            return new
            {
                rule.TagId,
                rule.SettingId,
                rule.Name,
                rule.Value
            };
        }

        private object flattenGroup(GroupModel group)
        {
            return new
            {
                group.Id,
                group.Name,
                group.ParentId,
                group.TypeId
            };
        }

        private object flattenDefinitionSetting(DefinitionModel definition)
        {
            return definition.Settings.Select(s => new
            {
                s.Id,
                s.DefinitionId,
                s.Priority
            });
        }
    }
}
