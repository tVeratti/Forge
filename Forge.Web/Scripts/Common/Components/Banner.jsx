// =====================================
const Banner = ({ header, children, icon = 'info' }) => {

    const className = `banner banner--${icon}`;

    return (
        <div className={className}>
            <div className='banner__icon' aria-hidden='true' />
            <div className='banner__content'>
                { header && <h5>{header}</h5> }
                <p className='summary'>{children}</p>
            </div>
        </div>
    );
}

module.exports = Banner;