const React = require('react');

// =====================================
const Sortable = React.createClass({
    // -----------------------------
    render: function(){
        let className = `sortable`;
        if (this.state.dragging) className += ' sortable--dragging';

        const { list } = this.props;
        const dragNodes = list.map(this.renderDraggable);
        const lastNode = this.state.initialIndex !== list.length
            ? this.renderSlot(list.length)
            : null;

        return (
            <ul className={className}>
                {dragNodes}
                {lastNode}
            </ul>
        );
    },

    // -----------------------------
    getInitialState: function(){
        return { 
            dragging: false,
            index: -1
        };
    },

    // -----------------------------
    renderDraggable: function(content, index){
        const { renderHandler } = this.props;
        const { initialIndex } = this.state;

        let handleNode;
        let className = 'sortable__item';
        let itemProps = {
            key: `item-${content.Id || content.Name}`,
            onDragOver: this.itemHover.bind(this, index)
        };

        const slotNode = initialIndex !== index
                ? this.renderSlot(index)
                : null;

        if (!content.DisableDrag){
            if (initialIndex === index) className += ' sortable__item--dragging';

            handleNode= (
                <span className='sortable__handle'
                    draggable={true}
                    onDragStart={this.beginDrag.bind(this, index)}
                    onDragEnd={this.endDrag} />
            );

        } else className += ' sortable__item--disabled';

        return [
            slotNode,
            <li {...itemProps} className={className}>
                {handleNode}
                <span className='sortable__content'>{content}</span>
            </li>
        ];
    },

    // -----------------------------
    renderSlot: function(index){
        const dropHandler = this.slotDrop.bind(this, index);
        const hoverHandler = this.slotHover.bind(this, index);

        let className = 'sortable__slot';
        if (index === this.state.index) className += ' sortable__slot--active';

        const key = `slot-${index}`;

        return <li key={key} className={className} onDragOver={hoverHandler} onDrop={dropHandler} />;
    },

    // -----------------------------
    beginDrag: function(index, ev){
        this.setState({ 
            dragging: true,
            initialIndex: index,
            index 
        });
    },

    // -----------------------------
    endDrag: function(ev){
        if (this.state.initialIndex !== this.state.index){
            this.slotDrop(this.state.index, ev);
        } else {
            this.setState({ 
                dragging: false, 
                index: -1,
                initialIndex: -1
            });
        }
    },

    // -----------------------------
    slotHover: function(index, ev){
        ev.preventDefault();
        this.setState({ index });
    },

    // -----------------------------
    itemHover: function(index, ev){
        ev.preventDefault();
        this.calculateActive(index, ev);
    },

    // -----------------------------
    calculateActive: function(index, ev){
        // Determine if the user is hovering over the top
        // or bottm half of the element in order to know
        // where the drop should be shown (above/below).
        const $target = $(ev.target);
        const itemHeight = $target.outerHeight();
        const itemOffset = $target.offset();

        const y = ev.pageY - itemOffset.top;

        if (itemHeight / 2 > y) {
            // Hovering top half of item.
            this.setState({ index });
        }
        else{
            // Hovering bottom half of item.
            this.setState({ index: index + 1 });
        }
    },

    // -----------------------------
    slotDrop: function(newIndex, ev){
        ev.preventDefault();
        const { initialIndex, index } = this.state;
        const { list, onChange } = this.props;

        const handler = (arr, i, i2) => {
            let newList = [ ...arr ];
            const moved = newList.splice(i, 1, '$RMV$')[0];
            newList.splice(i2, 0, moved);
            return newList.filter(l => l !== '$RMV$');
        }

        this.setState({ 
            dragging: false, 
            index: -1,
            initialIndex: -1
        });

        if (onChange) onChange(initialIndex, newIndex, handler);
    }
});

module.exports = Sortable;