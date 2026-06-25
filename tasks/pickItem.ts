import { PickItem, models, tasks, OrderStatus } from '@teamkeel/sdk';


export default PickItem({}, async (ctx, task) => {

	const i = await models.orderItem.findOne({ id: task.itemId });

	const picked = await ctx.ui.page("Pick", {
		content: [
			ctx.ui.display.markdown({ content: "Pick " + i!.product })
		],
		actions: [
			{ label: "Item(s) Picked", value: "picked" },
		]
	});

	await models.orderItem.update({ id: task.itemId }, { isPicked: true });

	const items = await models.orderItem.findMany({ where: { orderId: task.orderId } });

	for (const item of items) {
		if (item.isPicked == false) {
			return ctx.complete({ autoClose: true });
		}
	}

	await tasks.dispatchOrder.create({ orderId: task.orderId });

	return ctx.complete({ autoClose: true });
});