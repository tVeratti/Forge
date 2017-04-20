using System.Web.Mvc;
using Forge.Data.Models;

namespace Forge.Web.Infrastructure
{
    public abstract class BaseViewPage : WebViewPage
    {
        public virtual new UserModel User
        {
            get { return base.User as UserModel; }
        }
    }

    public abstract class BaseViewPage<TModel> : WebViewPage<TModel>
    {
        public virtual new UserModel User
        {
            get { return base.User as UserModel; }
        }
    }
}