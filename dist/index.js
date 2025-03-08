"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pubsub_1 = require("@google-cloud/pubsub");
function GoogleCloudPubSub() {
    return __awaiter(this, arguments, void 0, function* (projectId = 'devops01-450518', topicNameOrId = 'notifications', subscriptionName = 'test') {
        const pubsub = new pubsub_1.PubSub({ projectId });
        const [topics] = yield pubsub.getTopics();
        let topic = topics.find(t => t.name.endsWith(`/topics/${topicNameOrId}`));
        if (!topic) {
            [topic] = yield pubsub.createTopic(topicNameOrId);
            console.log(`Topic ${topic.name} created.`);
        }
        else {
            console.log(`Topic ${topic.name} already exists.`);
        }
        const [subscriptions] = yield pubsub.getSubscriptions();
        let subscription = subscriptions.find(s => s.name.endsWith(`/subscriptions/${subscriptionName}`));
        if (!subscription) {
            [subscription] = yield pubsub.createSubscription(topicNameOrId, subscriptionName);
            console.log(`Subscription ${subscription.name} created.`);
        }
        else {
            console.log(`Subscription ${subscription.name} already exists.`);
        }
        subscription.on('message', (message) => {
            console.log(`Received message: ${message.data.toString()}`);
            message.ack();
        });
        subscription.on('error', (error) => {
            console.error(`Error: ${error.message}`);
            process.exit(1);
        });
        const messageId = yield topic.publishMessage({ data: Buffer.from('Test message!') });
        console.log(`Message ${messageId} published.`);
    });
}
GoogleCloudPubSub();
