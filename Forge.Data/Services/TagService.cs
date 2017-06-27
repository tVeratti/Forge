using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;

using Dapper;

using Forge.Data.Models;

namespace Forge.Data.Services
{
    public class TagService
    {
        private readonly IDbConnection _cnx;

        public TagService(IDbConnection cnx) { this._cnx = cnx; }

        /// <summary>
        /// Create a Tag record in the database.
        /// </summary>
        /// <param name="Model">A model of the Tag properties.</param>
        /// <returns>The newly created Tag model.</returns>
        public long Create(TagModel model, long GameId)
        {
            var spr_name = "[Verspyre].[Insert_Tag]";
            var spr_prms = new { model.Name, model.CreatedById, GameId};

            return _cnx.Query<long>(spr_name, spr_prms, commandType: CommandType.StoredProcedure).SingleOrDefault();
        }

        /// <summary>
        /// Read all Tag records from the database.
        /// </summary>
        /// <returns>List of Tag models.</returns>
        public IEnumerable<TagModel> Read()
        {
            var spr_name = "[Verspyre].[Select_Tags]";
            return _cnx.Query<TagModel>(spr_name, commandType: CommandType.StoredProcedure);
        }

        /// <summary>
        /// Read one Tag record from the database by Id.
        /// </summary>
        /// <returns>The Tag model that matches the given Id's.</returns>
        public TagModel Read(long Id)
        {
            var spr_name = "[Verspyre].[Select_Tag]";
            return _cnx.Query<TagModel>(spr_name, new { Id }, commandType: CommandType.StoredProcedure).SingleOrDefault();
        }

        /// <summary>
        /// Read one Tag record from the database by Id.
        /// </summary>
        /// <returns>The Tag model that matches the given Id's.</returns>
        public TagModel Update(TagModel model)
        {
            var spr_name = "[Verspyre].[Update_Tag]";
            return _cnx.Query<TagModel>(spr_name, new { model.Id, model.Name, model.CreatedById }, commandType: CommandType.StoredProcedure).SingleOrDefault();
        }
    }
}
