import { DispatchOrder, models, OrderStatus } from '@teamkeel/sdk';



export default DispatchOrder({}, async (ctx, task) => {
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