﻿using System;
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
    public class DefinitionService
    {
        private readonly IDbConnection _cnx;

        public DefinitionService(IDbConnection cnx) { this._cnx = cnx; }

        /// <summary>
        /// Create a Definition record in the database.
        /// </summary>
        /// <param name="Model">A model of the Definition properties.</param>
        /// <returns>The newly created Definition model.</returns>
        public long Create(DefinitionModel Model, long UserId)
        {
            var spr_name = "[Verspyre].[Insert_Definition]";
            var spr_prms = new
            {
                Model.GameId,
                UserId
            };

            return _cnx.Query<long>(spr_name, spr_prms, commandType: CommandType.StoredProcedure).Single();
        }

        /// <summary>
        /// Read one Definition record from the database by Id.
        /// </summary>
        /// <returns>The Definition model that matches the given Id's.</returns>
        public void Update(DefinitionModel Definition, long UserId)
        {
            var spr_name = "[Verspyre].[Update_Definition]";

            var settings = Definition.Settings?.Select(s => (TableDefinitionSettingModel)s);
            var definitionSettings = Definition.GetSettingsValues();

            var spr_prms = new
            {
                Id = Definition.Id,
                Name = Definition.Name,
                ControlId = Definition.ControlId,
                GroupId = Definition.GroupId,
                UserId,
                Tags = Definition.Tags.ToDataTable(),
                Settings = settings.ToDataTable(),
                SettingsValues = definitionSettings.ToDataTable()
            };

            _cnx.Execute(spr_name, spr_prms, commandType: CommandType.StoredProcedure);
        }

        public void Delete(long Id, long UserId)
        {
            var spr_name = "[Verspyre].[Delete_Definition]";
            _cnx.Execute(spr_name, new { Id, UserId }, commandType: CommandType.StoredProcedure);
        }
    }
}
