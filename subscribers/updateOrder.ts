import { UpdateOrder, tasks, models, OrderStatus } from '@teamkeel/sdk';

// To learn more about events and subscribers, visit https://docs.keel.so/events
export default UpdateOrder(async (ctx, event) => {
    const order = await models.order.findOne({ id: event.target.id });

    if (!order) {
        throw new Error("order does not exist");
    }

    await tasks.dispatchOrder.create({ orderId: order.id });
});