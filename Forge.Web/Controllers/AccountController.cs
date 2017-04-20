using Microsoft.AspNet.Identity;
using Microsoft.Owin.Security;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

using Forge.Data;
using Forge.Data.Services;
using Forge.Data.Models;
using System.Threading;

namespace Forge.Web.Controllers
{
    public static class VerspyreClaims
    {
        public static string Id = "verspyre:user:id";
        public static string LastVisit = "verspyre:user:lastvisit";
        public static string CreatedDate = "verspyre:user:createdate";
        public static string Provider = "verspyre:user:provider";
    }

    public class AccountController : BaseController
    {
        private readonly DataContext _context;
        private IAuthenticationManager AuthenticationManager
        {
            get
            {
                return HttpContext.GetOwinContext().Authentication;
            }
        }

        public AccountController(DataContext context) { this._context = context; }

        [AllowAnonymous]
        public ActionResult Index(string ReturnUrl)
        {
            ViewBag.Message = TempData["Message"];
            TempData["ReturnUrl"] = ReturnUrl;
            return View();
        }

        [AllowAnonymous]
        [HttpPost]
        public ActionResult LogOn(string Email, string Password)
        {
            // Get user with this email on the database
            var user = _context.Users.Read(Email);

            if (user != null && user.Provider == "Internal" && !string.IsNullOrEmpty(Password))
            {
                // Security: Un-hash the user's password
                PasswordHasher hasher = new PasswordHasher();
                var verificationResult = hasher.VerifyHashedPassword(user.PasswordHash, Password);
                if (verificationResult == PasswordVerificationResult.Success)
                {
                    IdentitySignin(user);
                    string returnUrl = (TempData["ReturnUrl"] ?? "/Account/Index").ToString();
                    return Redirect(returnUrl);
                }
            }

            // Failed authentication
            TempData["Message"] = "Incorrect Email or Password";
            return RedirectToAction("Index");
        }

        [AllowAnonymous]
        public ActionResult LogOut()
        {
            IdentitySignout();
            return RedirectToAction("Index");
        }


        [AllowAnonymous]
        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<ActionResult> ExternalLogin(string Provider)
        {
            // Tell the provider what URL to use as authentcation callback
            var callbackAction = Url.Action("ExternalLoginCallback");

            // Send an authentication result to the external provider
            return new ChallengeResult(Provider, callbackAction);
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult> ExternalLoginCallback(string returnUrl)
        {

            // Handle external Login Callback
            var loginInfo = await AuthenticationManager.GetExternalLoginInfoAsync();

            // Failed Authentication
            if (loginInfo == null)
            {
                // Sign the user out
                IdentitySignout();
                return RedirectToAction("Index");
            }

            // Authenticated!
            string providerKey = loginInfo.Login.ProviderKey;
            string providerName = loginInfo.Login.LoginProvider;

            // External Login User Information
            // -----------------------------------
            var email = loginInfo.Email;
            UserModel user = new UserModel(email);
            user.UserName = loginInfo.DefaultUserName;
            user.Provider = providerName;

            // Get Verspyre User Information.
            // -----------------------------------
            // Retrieve record by Email.
            var localUser =  _context.Users.Read(user.Email);

            // If the user does not have a record in our database,
            // create one and return the new data.
            if (localUser == null)
            {
                localUser = _context.Users.Create(user);
            }

            // Update our claims user with the local data
            user.Id = localUser.Id;
            user.LastVisit = localUser.LastVisit;
            user.CreatedDate = localUser.CreatedDate;
            user.Provider = localUser.Provider;

            // Save the user info into a cookie
            // -----------------------------------
            // Update user claims
            IdentitySignin(user, loginInfo.Login.ProviderKey);
            string retUrl = (TempData["ReturnUrl"] ?? "/Account/Index").ToString();
            return Redirect(retUrl);
        }

        //public ActionResult Activate(long UserId, Guid ActivationId)
        //{
        //    var activationSuccess = _context.Users.Activate(UserId, ActivationId);
        //    if (activationSuccess)
        //    {
        //        var user = _context.Users.Read(UserId);
        //        IdentitySignin(user);
        //        return View();
        //    }
        //    return RedirectToAction("Index");
        //}

        public void IdentitySignin(UserModel user, string providerKey = null, bool isPersistent = false)
        {
            // Add claims to the AppUser cookie token
            var claims = new List<Claim>();

            // Local Claims
            claims.Add(new Claim(ClaimTypes.Email, user.Email));
            claims.Add(new Claim(ClaimTypes.Name, user.UserName ?? ""));
            claims.Add(new Claim(VerspyreClaims.Id, user.Id.ToString()));
            //claims.Add(new Claim(VerspyreClaims.LastVisit, user.LastVisit.ToString()));
            //claims.Add(new Claim(VerspyreClaims.CreatedDate, user.CreatedDate.ToString()));
            //claims.Add(new Claim(VerspyreClaims.Provider, user.Provider.ToString()));

            // Build a user identity with the claims
            var identity = new ClaimsIdentity(claims, DefaultAuthenticationTypes.ApplicationCookie);

            // Build the User cookie
            AuthenticationManager.SignIn(new AuthenticationProperties()
            {
                AllowRefresh = true,
                IsPersistent = isPersistent,
                ExpiresUtc = DateTime.UtcNow.AddDays(7)

            }, identity);
        }

        public void IdentitySignout()
        {
            AuthenticationManager.SignOut(DefaultAuthenticationTypes.ApplicationCookie,
                                          DefaultAuthenticationTypes.ExternalCookie);
        }
    }


    public class ChallengeResult : HttpUnauthorizedResult
    {
        public ChallengeResult(string provider, string redirectUri)
            : this(provider, redirectUri, null)
        { }

        public ChallengeResult(string provider, string redirectUri, string userId)
        {
            LoginProvider = provider;
            RedirectUri = redirectUri;
            UserId = userId;
        }

        public string LoginProvider { get; set; }
        public string RedirectUri { get; set; }
        public string UserId { get; set; }

        public override void ExecuteResult(ControllerContext context)
        {
            var properties = new AuthenticationProperties { RedirectUri = RedirectUri };
            //if (UserId != null)
            //    properties.Dictionary[XsrfKey] = UserId;

            var owin = context.HttpContext.GetOwinContext();
            owin.Authentication.Challenge(properties, LoginProvider);
        }
    }
}