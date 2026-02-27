import { DispatchOrder, FlowConfig, tasks } from '@teamkeel/sdk';

const config = {
	// See https://docs.keel.so/flows for options
} as const satisfies FlowConfig;

export default DispatchOrder(config, async (ctx, task) => {

	const value = await ctx.ui.page("page1",
		{
			content: [
				ctx.ui.inputs.text("soemthing")
			]
		}
	);

	return value.soemthing;
});