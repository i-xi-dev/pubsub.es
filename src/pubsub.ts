/**
 * The topic-based Pub/Sub
 */
namespace PubSub {
  /**
   * The topic.
   */
  export type Topic = symbol | string;

  /**
   * The object with the following optional fields.
   */
  export type SubscriptionOptions = {
    /**
     * Whether the callback will be invoked at most once.
     * The default is `false`.
     */
    once?: boolean;

    /**
     * The `AbortSignal` object.
     */
    signal?: AbortSignal;
  };

  /**
   * The message broker.
   * @typeParam T - The type of the message.
   */
  export class Broker<T> {
    /**
     * 購読の登録簿
     */
    readonly #subscriptions: Map<
      Topic,
      Map<(message: T) => Promise<void>, SubscriptionOptions>
    >;

    /** */
    constructor() {
      this.#subscriptions = new Map();
      Object.freeze(this);
    }

    /**
     * Subscribes to a topic to consume messages.
     *
     * @param topic - The topic to subscribe.
     * @param callback - The subscription callback.
     * @param options - The `PubSub.SubscriptionOptions` object.
     */
    subscribe(
      topic: Topic,
      callback: (message: T) => Promise<void>,
      options: SubscriptionOptions = {},
    ): void {
      if (this.#subscriptions.has(topic) !== true) {
        this.#subscriptions.set(topic, new Map());
      }
      const topicSubscriptions = this.#subscriptions.get(topic) as Map<
        (message: T) => Promise<void>,
        SubscriptionOptions
      >;

      if (topicSubscriptions.has(callback)) {
        return;
      }

      if (options.signal instanceof AbortSignal) {
        if (options.signal.aborted === true) {
          return;
        }

        options.signal.addEventListener("abort", (): void => {
          this.unsubscribe(topic, callback);
        }, { once: true });
      }

      topicSubscriptions.set(callback, options);
    }

    /**
     * Unsubscribe from the topic.
     *
     * @param topic - The topic to be unsubscribed.
     * @param callback - The subscription callback.
     */
    unsubscribe(topic: Topic, callback: (message: T) => Promise<void>): void {
      if (this.#subscriptions.has(topic)) {
        const topicSubscriptions = this.#subscriptions.get(topic) as Map<
          (message: T) => Promise<void>,
          SubscriptionOptions
        >;
        topicSubscriptions.delete(callback);
      }
    }

    //TODO clearTopic(topic) | unsubscribe(topic)

    /**
     * Clears all subscriptions and all topics.
     */
    clear(): void {
      for (const topicSubscriptions of this.#subscriptions.values()) {
        topicSubscriptions.clear();
      }
      this.#subscriptions.clear();
    }

    /**
     * Sends a message to the topic.
     *
     * @param topic - The topic.
     * @param message - A message to send.
     */
    async publish(topic: Topic, message: T): Promise<void> {
      if (this.#subscriptions.has(topic)) {
        const topicSubscriptions = this.#subscriptions.get(topic) as Map<
          (message: T) => Promise<void>,
          SubscriptionOptions
        >;
        const tasks = [...topicSubscriptions.entries()].map(
          ([callback, options]) => {
            return (async (): Promise<void> => {
              if (options.once === true) {
                this.unsubscribe(topic, callback);
              }
              return await callback(message);
            })();
          },
        );
        const results = await Promise.allSettled(tasks);

        const rejectedResults: PromiseRejectedResult[] = results.filter((
          result,
        ) => result.status === "rejected") as PromiseRejectedResult[];
        if (rejectedResults.length > 0) {
          const errors: Error[] = rejectedResults.map(
            (result: PromiseRejectedResult): Error => {
              if (result.reason instanceof Error) {
                return result.reason;
              }
              return new Error(`${JSON.stringify(result.reason)}`);
            },
          );
          throw new AggregateError(errors);
        }
      }
    }
  }
  Object.freeze(Broker);
}
Object.freeze(PubSub);

export { PubSub };
