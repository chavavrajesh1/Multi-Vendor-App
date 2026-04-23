import { EventEmitter } from "node:stream";

class AppEventBus extends EventEmitter {}

export const eventBus = new AppEventBus();