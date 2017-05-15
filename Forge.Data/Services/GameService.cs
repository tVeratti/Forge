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
    public class GameService
    {
        private readonly IDbConnection _cnx;

        public GameService(IDbConnection cnx) { this._cnx = cnx; }
        
        /// <summary>
        /// Create a Game record in the database.
        /// </summary>
        /// <param name="Model">A model of the Game properties.</param>
        /// <returns>The newly created Game model.</returns>
        public IEnumerable<GameModel> Create(string Name, long CreatedById)
        {
            var spr_name = "[Verspyre].[Insert_Game]";
            var spr_prms = new { Name, CreatedById };

            return _cnx.Query<GameModel>(spr_name, spr_prms, commandType: CommandType.StoredProcedure);
        }

        /// <summary>
        /// Read all Game records from the database.
        /// </summary>
        /// <returns>List of Game models.</returns>
        public IEnumerable<GameModel> Read(long UserId)
        {
            var spr_name = "[Verspyre].[Select_Games]";
            return _cnx.Query<GameModel>(spr_name, new { UserId }, commandType: CommandType.StoredProcedure);
        }

        /// <summary>
        /// Read one Game record from the database by Id.
        /// </summary>
        /// <param name="Id">The Game's Id.</param>
        /// <returns>The Game model that matches the given Id.</returns>
        public GameModel Find(long Id)
        {
            var spr_name = "[Verspyre].[Select_Game]";
            return _cnx.Query<GameModel>(spr_name, new { Id }, commandType: CommandType.StoredProcedure).Single();
        }

        /// <summary>
        /// Update a single Game record in the database.
        /// </summary>
        /// <param name="Model">The Game properties that should</param>
        /// <returns>The updated Game model.</returns>
        public GameModel Update(GameModel Model)
        {
            var spr_name = "[Verspyre].[Update_Game]";
            return _cnx.Query<GameModel>(spr_name, Model, commandType: CommandType.StoredProcedure).Single();
        }

        /// <summary>
        /// Delete a single Game record from the database.
        /// </summary>
        /// <param name="Id">The Id of the Game to delete.</param>
        public void Delete(long Id)
        {
            var spr_name = "[Verspyre].[Delete_Game]";
            _cnx.Execute(spr_name, new { Id }, commandType: CommandType.StoredProcedure);
        }

        /// <summary>
        /// Read all data required to build the Game Designer view.
        /// </summary>
        /// <param name="Id">The Id of the Game to request data for.</param>
        public CoreModel Designer(long Id, long UserId)
        {
            var spr_name = "[Verspyre].[Select_Designer]";
            using (var multi = _cnx.QueryMultiple(spr_name, new { Id, UserId }, commandType: CommandType.StoredProcedure))
            {
                // Read Designer DataSets
                // --------------------------------------------------
                CoreModel model = new CoreModel()
                {
                    Game =          multi.Read<GameModel>().Single(),
                    Rules =         multi.Read<RuleModel>(),
                    Definitions =   multi.Read<DefinitionModel>(),
                    Settings =      multi.Read<SettingModel>(),
                    Tags =          multi.Read<TagModel>(),
                    Controls =      multi.Read<ControlModel>(),
                    Groups =        multi.Read<GroupModel>()
                };

                // Map Definition Properties
                // --------------------------------------------------
                // DefinitionTagModels, DefinitionSettingModels
                var definitionTags =        multi.Read<DefinitionTagModel>();
                var definitionSettings =    multi.Read<DefinitionSettingModel>();

                model.Definitions = model.Definitions.Select(d => MappingService.MapDefinition(model, d, definitionTags, definitionSettings));

                return model;
            } 
        }
    }
}
