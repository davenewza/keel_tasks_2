import { ApproveOrder, FlowConfig, models, OrderStatus } from '@teamkeel/sdk';

const config = {
	// See https://docs.keel.so/flows for options
} as const satisfies FlowConfig;

export default ApproveOrder(config, async (ctx, task) => {
	const order = await models.order.findOne({ id: task.orderId });

	if (!order) {
		throw new Error("no such order exists");
	}

	if (order.status == OrderStatus.Approved) {
		return ctx.complete({ description: "Order is already approved", autoClose: false });
	}

	const verify = await ctx.ui.page("Verify approval", {
		content: [
			ctx.ui.display.keyValue({ data: [{ key: "Invoice No.", value: order.id }] }),
			ctx.ui.display.keyValue({ data: [{ key: "Status.", value: order.status }] })
		],
		actions: [
			{ label: "Approve", value: "approve" },
			{ label: "Cancel Order", value: "cancel" },
		]
	});

	if (verify.action == "approve") {
		await ctx.step("approving order", async () => {
			await models.order.update({ id: task.orderId }, { status: OrderStatus.Approved });
		});

		return ctx.complete({
			description: "Order approved!",
			autoClose: true,
			// content: [
			// 	ctx.ui.display.keyValue({ data: [{ key: "Invoice No.", value: order.id }] }),
			// 	ctx.ui.display.keyValue({ data: [{ key: "Status.", value: OrderStatus.Approved }] })
			// ]
		});
	}

	return ctx.complete({ description: "Order cancelled!", autoClose: false });
});