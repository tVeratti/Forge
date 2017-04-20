using Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.AspNet.Identity;
using System.Web.Helpers;
using System.Security.Claims;

[assembly: OwinStartupAttribute(typeof(Forge.Web.Startup))]
namespace Forge.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }

        string _googleId = "1096235534193-8b6jo3rttb987a8pekfjdt7lsh26rl4g.apps.googleusercontent.com";
        string _googleSecret = "3eRYOAIEznZtdB3WyYbzVgMq";

        // For more information on configuring authentication, please visit http://go.microsoft.com/fwlink/?LinkId=301864
        public void ConfigureAuth(IAppBuilder app)
        {
            // Enable the application to use a cookie to store information for the signed in user
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
                LoginPath = new PathString("/Account/Index")
            });

            app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);


            app.UseGoogleAuthentication(
                clientId: _googleId,
                clientSecret: _googleSecret);

            //app.UseTwitterAuthentication(
            //    consumerKey: App.Secrets.TwitterConsumerKey,
            //    consumerSecret: App.Secrets.TwitterConsumerSecret);

            AntiForgeryConfig.UniqueClaimTypeIdentifier = ClaimTypes.NameIdentifier;
        }
    }
}
