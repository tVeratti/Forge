// =====================================
// <Tooltip />
// =====================================
const Tooltip = ({ children, tip }) => {

    return (
        <div className='tooltip'>
            {children}

            <div className='tooltip__value'>
                {tip}
            </div>
        </div>
    );
}