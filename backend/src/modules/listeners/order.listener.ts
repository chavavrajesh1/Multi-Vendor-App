import { eventBus } from "../../utils/eventBus";

eventBus.on("orderCreated", async (order) => {
    console.log("Order created event received:", order._id);

    // Simulate:
    // 1. Send notification
    // 2. Send email
    // 3. Trigger payment workflow
    // 4. Update analytics
});