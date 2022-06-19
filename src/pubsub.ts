//

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
    /** 1回のみか否か */
    once?: boolean;

    /** 中断シグナル */
    signal?: AbortSignal;
  };

  /**
   * The message broker.
   * @typeParam T publishされるメッセージの型、かつ購読コールバックの第1引数の型
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
     * 購読登録する
     * @param topic トピック
     * @param callback 購読コールバック
     * @param options 購読オプション
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
     * 購読登録を解除する
     * @param topic トピック
     * @param callback 購読コールバック ※subscribeしたのと同じ参照先である必要がある
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

    /**
     * すべての購読を解除する
     * トピックも登録簿からすべて削除する
     */
    clear(): void {
      for (const topicSubscriptions of this.#subscriptions.values()) {
        topicSubscriptions.clear();
      }
      this.#subscriptions.clear();
    }

    /**
     * 出版する
     * 
     * @param topic トピック
     * @param message メッセージ
     * @returns
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
