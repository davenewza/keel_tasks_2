import { DispatchOrder, FlowConfig, models, OrderStatus } from '@teamkeel/sdk';

const config = {
	// See https://docs.keel.so/flows for options
} as const satisfies FlowConfig;

export default DispatchOrder(config, async (ctx, task) => {
	const order = await models.order.findOne({ id: task.orderId });

	if (!order) {
		throw new Error("no such order exists");
	}

	if (order.status == OrderStatus.New) {
		throw new Error("Order is not approved yet!")
	}

	if (order.status == OrderStatus.Dispatched) {
		return ctx.complete({ description: "Order is already dispatched", autoClose: false });
	}

	await ctx.step("dispatching order", async () => {
		await models.order.update({ id: task.orderId }, { status: OrderStatus.Dispatched });
	});

	return ctx.complete({ description: "Order dispatched!", autoClose: false });
});