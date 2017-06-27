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

        public void Update(CoreModel Model)
        {
            var spr_name = "[Verspyre].[Update_Core]";

            // Flatten Models
            var definitions = Model.Definitions.Select(d => (TableDefinitionModel)d);
            var tags = Model.Tags.Select(t => (TableTagModel)t);
            var rules = Model.Rules.Select(r => (TableRuleModel)r);
            var groups = Model.Groups.Select(g => (TableGroupModel)g);

            var definitionSettings = Model.Definitions.SelectMany(d => d.Settings);
            var definitionSettingValues = Model.Definitions.SelectMany(d => d.GetSettingsValues());

            //var spr_prms = new
            //{
            //    ModifiedById = userId,

            //    // Game
            //    Name = Model.Game.Name,
            //    GenreId = Model.Game.GenreId,

            //    // DataTables
            //    Tags = tags.ToDataTable(),
            //    Rules = rules.ToDataTable(),
            //    Definitions = definitions.ToDataTable(),
            //    Groups = groups.ToDataTable(),

            //    // LookUps

            //};

            //_cnx.Execute(spr_name, spr_prms, commandType: CommandType.StoredProcedure);
        }

        private object getSettings(DefinitionModel definition)
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
