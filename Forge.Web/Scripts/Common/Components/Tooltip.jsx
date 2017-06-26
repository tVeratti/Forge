// =====================================
// <Tooltip />
// =====================================
const Tooltip = ({ children, tip, onClick }) => {

    return (
        <div className='tooltip' onClick={onClick}>
            {children}

            <div className='tooltip__value'>
                {tip}
            </div>
        </div>
    );
}