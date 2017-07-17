const moment = require('moment');

// =====================================
const Game = ({ ...game }) => {
    const updated = moment(game.ModifiedDate).format('MMM DD');
    const created = moment(game.CreatedDate).format('MMM DD');

    return (
        <li className='library__game game panel panel--clickable'>
            <a href={`/Designer?id=${game.Id}`}>
                {/* Icons */}
                <div className='game__column game__column--icons'>
                </div>

                {/* Name, Creator */}
                <div className='game__column game__column--summary'>
                    <p className='game__name'>{game.Name}</p>
                    <p>{game.CreatedByUserName}</p>
                </div>

                {/* Dates */}
                <div className='game__column game__column--dates'>
                    <p>{created}</p>
                    <p>{updated}</p>
                </div>
            </a>
        </li>
    )
};

module.exports = Game;