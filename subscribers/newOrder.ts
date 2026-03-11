import { NewOrder, tasks } from '@teamkeel/sdk';

// To learn more about events and subscribers, visit https://docs.keel.so/events
export default NewOrder(async (ctx, event) => {
    await tasks.approveOrder.create({ orderId: event.target.id });
});