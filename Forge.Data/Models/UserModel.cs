using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace Forge.Data.Models
{
    public class UserModel : IPrincipal
    {
        // Identity Required Props
        // ---------------------------------
        public IIdentity Identity { get; private set; }
        public bool IsInRole(string role) { return false; }

        // Table Props
        // ---------------------------------
        public long Id { get; set; }
        public string UserName { get; set; }
        public DateTime LastVisit { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Provider { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }

        // Constructors
        // ---------------------------------
        public UserModel() { }
        public UserModel(string Email)
        {
            this.Identity = new GenericIdentity(Email);
            this.Email = Email;
        }
    }
}