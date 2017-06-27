using System.Data;
using System.Data.SqlClient;
using System.Configuration;

using Forge.Data.Services;

namespace Forge.Data
{
    public class DataContext
    {
        private IDbConnection _cnx;

        // Private Services
        // ---------------------------------
        private UserService _users;
        private CoreService _core;
        private GameService _games;
        private RuleService _rules;
        private TagService _tags;
        private DefinitionService _definitions;

        // Public Properties
        // ---------------------------------
        public UserService Users
        {
            get
            {
                return _users == null ? _users = new UserService(_cnx) : _users;
            }
        }

        public CoreService Core
        {
            get
            {
                return _core == null ? _core = new CoreService(_cnx) : _core;
            }
        }

        public GameService Games
        {
            get
            {
                return _games == null ? _games = new GameService(_cnx) : _games;
            }
        }
        public RuleService Rules
        {
            get
            {
                return _rules == null ? _rules = new RuleService(_cnx) : _rules;
            }
        }

        public TagService Tags
        {
            get
            {
                return _tags == null ? _tags = new TagService(_cnx) : _tags;
            }
        }

        public DefinitionService Definitions
        {
            get
            {
                return _definitions == null ? _definitions = new DefinitionService(_cnx) : _definitions;
            }
        }

        // Methods
        // ---------------------------------
        public DataContext()
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
            _cnx = new SqlConnection(connectionString);
        }

    }
}
