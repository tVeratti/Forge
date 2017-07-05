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

        public void Update(CoreModel Model, long UserId)
        {
            var spr_name = "[Verspyre].[Update_Core]";

            // Flatten Models
            var definitions = Model.Definitions.Select(d => (TableDefinitionModel)d);
            var tags = Model.Tags.Select(t => (TableTagModel)t);
            var rules = Model.Rules.Select(r => (TableRuleModel)r);
            var groups = Model.Groups.Select(g => (TableGroupModel)g);

            var definitionValues = Model.Definitions.SelectMany(d => d.Keys);
            var definitionSettings = Model.Definitions.SelectMany(d => d.Settings);
            var definitionSettingValues = Model.Definitions.SelectMany(d => d.GetSettingsValues());
            var rulesValues = Model.Rules.SelectMany(r => r.Keys);

            var spr_prms = new
            {
                UserId,

                // Game
                GameId = Model.Game.Id,
                Name = Model.Game.Name,

                // DataTables
                GenreIds = Model.Game.GenreIds.ToDataTable(),
                Tags = tags.ToDataTable(),
                Rules = rules.ToDataTable(),
                Definitions = definitions.ToDataTable(),
                Groups = groups.ToDataTable(),

                // LookUps
                DefinitionValues = definitionSettingValues.ToDataTable(),
                DefinitionSettings = definitionSettings.ToDataTable(),
                DefinitionSettingsValues = definitionSettingValues.ToDataTable(),
                RulesValues = rulesValues.ToDataTable()

            };

            //_cnx.Execute(spr_name, spr_prms, commandType: CommandType.StoredProcedure);
        }

        public long CreateGroup(GroupModel Model, long UserId)
        {
            var spr_name = "[Verspyre].[Insert_Group]";

            var spr_prms = new
            {
                Model.GameId,
                Model.Name,
                Model.ParentId,
                Model.TypeId,
                UserId
            };

            return _cnx.Query<long>(spr_name, spr_prms, commandType: CommandType.StoredProcedure).SingleOrDefault();
        }

        public void UpdateGroup(GroupModel Model, long UserId)
        {
            var spr_name = "[Verspyre].[Update_Group]";

            var spr_prms = new
            {
                Model.Id,
                Model.Name,
                Model.ParentId,
                Model.TypeId,
                UserId
            };

            _cnx.Execute(spr_name, spr_prms, commandType: CommandType.StoredProcedure);
        }

    }
}
