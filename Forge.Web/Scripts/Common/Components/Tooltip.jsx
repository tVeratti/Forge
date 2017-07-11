// =====================================
const Tooltip = ({ children, tip, onClick, icon }) => {
    const iconNode = icon
        ? <span className='fa fa-info-circle' aria-hidden='true' />
        : undefined;

    return (
        <div className='tooltip' onClick={onClick}>
            {children}
            {icon}
            <div className='tooltip__value'>
                {tip}
            </div>
        </div>
    );
}

module.exports = Tooltip;