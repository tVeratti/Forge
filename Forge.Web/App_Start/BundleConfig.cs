using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Optimization;

namespace Forge.Web
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            // Vendor
            // ---------------------------
            bundles.Add(new ScriptBundle("~/scripts/vendor-js").Include(
                 "~/Scripts/Vendor/jquery-1.10.2.js",
                 "~/Scripts/Vendor/moment.js",
                 
                 "~/Scripts/Vendor/react-with-addons-15.3.2.js",
                 "~/Scripts/Vendor/react-dom-15.3.2.js",

                 "~/Scripts/Vendor/redux-3.6.0.js",
                 "~/Scripts/Vendor/redux-thunk-2.0.1.js",
                 "~/Scripts/Vendor/redux-debounced-0.3.0.js",
                 "~/Scripts/Vendor/react-redux-4.4.5.js"));

            // Tests
            // ---------------------------
            bundles.Add(new ScriptBundle("~/scripts/tests-js").Include(
                "~/Scripts/Vendor/enzyme-2.7.1.js",
                "~/Scripts/Vendor/jasmine.js",
                "~/Content/tests.js"));

            // Custom
            // ---------------------------
            bundles.Add(new ScriptBundle("~/scripts/app-js")
                .Include("~/Content/scripts.js"));


            // Styles
            // ---------------------------
            bundles.Add(new StyleBundle("~/Styles/main-css").Include(
                 "~/Styles/site.css"));

            // MINIFICATION
            // ----------------------------------------------------
            BundleTable.EnableOptimizations = true;
        }
    }
}
