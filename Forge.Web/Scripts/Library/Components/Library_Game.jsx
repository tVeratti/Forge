// =====================================
// <Library.Game />
// =====================================
Library.Game = ({ ...game }) => {
    return (
        <li className='library__game'>
            <a href={`/Designer?id=${game.Id}`}>
                <p>{game.Name}</p>
                <p>{game.CreatedByUserName}</p>
            </a>
        </li>
    )
};