// LifeCycle Management
// =====================================
const lifeCycle = new LifeCycle();

function LifeCycle(){
	// Stages
	// --------------------------------
	const _stages = {
		wait:			'Wait',
		init:			'Initialize',
		initAndUpdate: 	'InitializeAndUpdate',
		update: 		'Update'
	};

	// Order
	// --------------------------------
	const _order = [
		_stages.wait,
		_stages.init,
		_stages.initAndUpdate,
		_stages.update
	];

	// --------------------------------
	const _isActive = (settingStage, stage) => {
		if (!store) return false;

		const { init, update } = _stages;
		const index = _order.indexOf(settingStage);

		switch(stage){
			case init: return index === 1 || index === 2;
			case update: return index === 2 || index === 3;
			default: return false;
		}
	}

	return {
		stages: _stages,
		order: _order,
		isActive: _isActive
	};
};

module.exports = lifeCycle;