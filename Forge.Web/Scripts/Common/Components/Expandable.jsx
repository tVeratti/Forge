
const Expandable = React.createClass({
    // -----------------------------
    render: function(){
        const { children, header } = this.props;
        const { open } = this.state;

        const toggleOpen = () => this.setState({ open: !open });
        const title = open ? 'Collapse' : 'Expand';

        const className = `expandable expandable--${open ? 'open' : 'closed'}`

        return (
            <div className={className}>
                {/* Header */}
                <div className='expandable__header'>
                    <div className='expandable__button'>
                        <button className='expandable__icon' onClick={toggleOpen} title={title} />
                    </div>
                    <label className='expandable__label'>{header}</label>
                </div>

                {/* Conditionally Rendered Children */}
                { open && <div className='expandable__content'>{children}</div> }
            </div>
        );
    },

    // -----------------------------
    getInitialState: function(){
        return { open: false };
    }
});