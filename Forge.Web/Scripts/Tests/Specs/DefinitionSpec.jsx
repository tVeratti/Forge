const { shallow, mount } = enzyme;

// =============================================
describe('Core > Definition', () => {
    const options = [
        { Id: 1, Display: 'One' },
        { Id: 2, Display: 'Two' },
        { Id: 3, Display: 'Three' }
    ];

    const options2 = [
        { Id: 4, Display: 'Four' },
        { Id: 5, Display: 'Five' },
        { Id: 6, Display: 'Six' }
    ];

    // ------------------------------
    beforeEach(function () { });

    // ======================================================================
    describe('Render: ', () => {

        // ------------------------------
        it('can render a Number control', () => {
            const props = {
                model: { Control: 'Number' }
            };
            
            const node = mount(<Forge.Definition store={store} {...props} />);
            const control = node.find(Forge.components.controls.Number);

            expect(control.length).toBe(1)
        });

        // ------------------------------
        it('can render a Text control', () => {
            const props = {
                model: { Control: 'Text' }
            };
            
            const node = mount(<Forge.Definition store={store} {...props} />);
            const control = node.find(Forge.components.controls.Text);

            expect(control.length).toBe(1)
        });
    });
});
