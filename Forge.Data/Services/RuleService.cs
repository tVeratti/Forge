﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;

using Dapper;

using Forge.Data.Models;

namespace Forge.Data.Services
{
    public class RuleService
    {
        private readonly IDbConnection _cnx;

        public RuleService(IDbConnection cnx) { this._cnx = cnx; }

        /// <summary>
        /// Create a Rule record in the database.
        /// </summary>
        /// <param name="Model">A model of the Rule properties.</param>
        /// <returns>The newly created Rule model.</returns>
        public RuleModel Create(RuleModel model)
        {
            var spr_name = "[Verspyre].[Insert_Rule]";
            var spr_prms = new { model.SettingId, model.TagId, model.Value, model.CreatedById };

            return _cnx.Query<RuleModel>(spr_name, spr_prms, commandType: CommandType.StoredProcedure).Single();
        }

        /// <summary>
        /// Read all Rule records from the database.
        /// </summary>
        /// <returns>List of Rule models.</returns>
        public IEnumerable<RuleModel> Read()
        {
            var spr_name = "[Verspyre].[Select_Rules]";
            return _cnx.Query<RuleModel>(spr_name, commandType: CommandType.StoredProcedure);
        }

        /// <summary>
        /// Read one Rule record from the database by Id.
        /// </summary>
        /// <returns>The Rule model that matches the given Id's.</returns>
        public RuleModel Read(long SettingId, long TagId)
        {
            var spr_name = "[Verspyre].[Select_Rule]";
            return _cnx.Query<RuleModel>(spr_name, new { SettingId, TagId }, commandType: CommandType.StoredProcedure).Single();
        }
    }
}
