﻿const actions = require('./../Actions.js');

const Button = require('./Button.jsx');

// =====================================
const Dialog = (props) => {
    const { children, header, buttons, requiredAction, onClose } = props;

    const close = onClose
        ? () => onClose()
        : () => store.dispatch(actions.closeDialog());
        
    const overlayClick = requiredAction ? null : close;

    return (
        <div className='dialog'>
            <div className='dialog__container'>
                <div className='dialog__overlay overlay' onClick={overlayClick} />

                <div className='dialog__window'>
                    {/* Header */}
                    <div className='dialog__header'>
                        <div>{header}</div>
                        <div>
                            <Button className='dialog__close button button--transparent' onClick={close} title='Close'>
                                <span className='fa fa-remove' />
                            </Button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className='dialog__content'>{children}</div>

                    {/* Content */}
                    <div className='dialog__buttons'>
                        { buttons || <Button onClick={close}>Close</Button> }
                    </div>
                </div>
            </div>
        </div>
    );
};

module.exports = Dialog;