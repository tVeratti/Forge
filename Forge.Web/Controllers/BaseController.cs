using System.Web.Mvc;

using Forge.Data.Models;

namespace Forge.Web.Controllers
{
    [Authorize]
    public class BaseController : Controller
    {
        protected virtual new UserModel User
        {
            get { return HttpContext.User as UserModel ?? new UserModel(); }
        }
    }
}