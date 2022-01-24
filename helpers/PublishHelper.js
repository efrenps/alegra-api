import { PubSub } from 'graphql-subscriptions';
import { HandledError } from '../utilities/CustomError.js';

const pubsub = new PubSub();

export class PublishHelper {
    static execute(publicationName, data) {
        if (pubsub) {
            pubsub.publish(publicationName, data);
        } else {
            throw new HandledError('A pubsub object was not provided');
        }
    }

    static getPubSub() {
        return pubsub;
    }
}