using Forge.Data.Models;
using Forge.Web.Controllers;
using System;
using System.Security.Claims;
using System.Threading;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace Forge.Web
{
    public class MvcApplication : HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }

        protected void Application_PostAuthenticateRequest(Object sender, EventArgs e)
        {

            var identity = Thread.CurrentPrincipal as ClaimsPrincipal;

            if (identity != null && identity.Identity.IsAuthenticated)
            {
                // User: Email
                // ---------------------
                // Email gathered first - this is important for
                // instantiating the Identity within our UserModel.
                var email = GetClaim(identity, ClaimTypes.Email);

                // Instantiate the UserModel with the Email
                var user = new UserModel(email);

                // User: Id
                // ---------------------
                string claimsId = GetClaim(identity, VerspyreClaims.Id);
                user.Id = long.Parse(claimsId);

                // User: UserName
                // ---------------------
                user.UserName = GetClaim(identity, ClaimTypes.Name);

                //// User: LastVisit
                //// ---------------------
                //string claimsVisit = GetClaim(identity, VerspyreClaims.LastVisit);
                //DateTime lastVisit;
                //DateTime.TryParse(claimsVisit, out lastVisit);
                //user.LastVisit = lastVisit;

                //// User: CreateDate
                //// ---------------------
                //string claimsCreate = GetClaim(identity, VerspyreClaims.CreatedDate);
                //DateTime createDate;
                //DateTime.TryParse(claimsCreate, out createDate);
                //user.CreatedDate = createDate;

                //// User: Provider
                //// ---------------------
                //user.Provider = GetClaim(identity, VerspyreClaims.Provider);

                HttpContext.Current.User = user;
            }

        }

        private string GetClaim(ClaimsPrincipal identity, string type)
        {
            if (identity.HasClaim(c => c.Type == type))
            {
                // Return claim value as string
                return identity.FindFirst(type).Value;
            }
            else
            {
                // Identity does not have the claim
                return string.Empty;
            }
        }
    }
}
