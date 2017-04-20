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
    public class UserService
    {
        private readonly IDbConnection _cnx;

        public UserService(IDbConnection cnx) { this._cnx = cnx; }
        
        /// <summary>
        /// Create a User record in the database.
        /// </summary>
        /// <param name="Model">A model of the User properties.</param>
        /// <returns>The newly created User model.</returns>
        public UserModel Create(UserModel Model)
        {
            var spr_name = "[Verspyre].[Insert_User]";
            var spr_prms = new
            {
                UserName = Model.UserName,
                Email = Model.Email,
                Provider = Model.Provider
            };

            return _cnx.Query<UserModel>(spr_name, spr_prms, commandType: CommandType.StoredProcedure).Single();
        }

        /// <summary>
        /// Read all User records from the database.
        /// </summary>
        /// <returns>List of User models.</returns>
        public IEnumerable<UserModel> Read()
        {
            var spr_name = "[Verspyre].[Select_Users]";
            return _cnx.Query<UserModel>(spr_name, commandType: CommandType.StoredProcedure);
        }

        /// <summary>
        /// Find one User that matches the given Email address.
        /// </summary>
        /// <returns>A UserModel that matches the given Email.</returns>
        public UserModel Read(string Email)
        {
            var spr_name = "[Verspyre].[Select_User_Email]";
            return _cnx.Query<UserModel>(spr_name, new { Email }, commandType: CommandType.StoredProcedure).FirstOrDefault();
        }

        /// <summary>
        /// Read one User record from the database by Id.
        /// </summary>
        /// <param name="Id">The User's Id.</param>
        /// <returns>The User model that matches the given Id.</returns>
        public UserModel Read(long Id)
        {
            var spr_name = "[Verspyre].[Select_User]";
            return _cnx.Query<UserModel>(spr_name, new { Id }, commandType: CommandType.StoredProcedure).Single();
        }

        /// <summary>
        /// Update a single User record in the database.
        /// </summary>
        /// <param name="Model">The User properties that should</param>
        /// <returns>The updated User model.</returns>
        public UserModel Update(UserModel Model)
        {
            var spr_name = "[Verspyre].[Update_User]";
            return _cnx.Query<UserModel>(spr_name, Model, commandType: CommandType.StoredProcedure).Single();
        }

        /// <summary>
        /// Delete a single User record from the database.
        /// </summary>
        /// <param name="Id">The Id of the User to delete.</param>
        public void Delete(long Id)
        {
            var spr_name = "[Verspyre].[Delete_User]";
            _cnx.Execute(spr_name, new { Id }, commandType: CommandType.StoredProcedure);
        }
    }
}
