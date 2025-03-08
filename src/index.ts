import { PubSub } from "@google-cloud/pubsub";

async function GoogleCloudPubSub(
    projectId = 'devops01-450518',
    topicNameOrId = 'notifications',
    subscriptionName = 'test'
) {
    const pubsub = new PubSub({ projectId });


    const [topics] = await pubsub.getTopics();
    let topic = topics.find(t => t.name.endsWith(`/topics/${topicNameOrId}`));
    
    if (!topic) {
        [topic] = await pubsub.createTopic(topicNameOrId);
        console.log(`Topic ${topic.name} created.`);
    } else {
        console.log(`Topic ${topic.name} already exists.`);
    }


    const [subscriptions] = await pubsub.getSubscriptions();
    let subscription = subscriptions.find(s => s.name.endsWith(`/subscriptions/${subscriptionName}`));
    
    if (!subscription) {
        [subscription] = await pubsub.createSubscription(topicNameOrId, subscriptionName);
        console.log(`Subscription ${subscription.name} created.`);
    } else {
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


    const messageId = await topic.publishMessage({ data: Buffer.from('Test message!') });
    console.log(`Message ${messageId} published.`);
}

GoogleCloudPubSub()
