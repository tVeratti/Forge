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
                ModifiedById = UserId,

                // Game
                Name = Model.Game.Name,
                GenreId = Model.Game.GenreId,

                // DataTables
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
    }
}
