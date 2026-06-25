import { UpdateOrder, tasks, models, OrderStatus } from '@teamkeel/sdk';

export default UpdateOrder(async (ctx, event) => {
    const order = await models.order.findOne({ id: event.target.id });

    if (!order) {
        throw new Error("order does not exist");
    }

    if (order.status == OrderStatus.Approved) {
        const items = await models.orderItem.findMany({ where: { orderId: event.target.id } });

        for (const item of items) {
            await tasks.pickItem.create({ orderId: event.target.id, itemId: item.id });
        }
    }
});