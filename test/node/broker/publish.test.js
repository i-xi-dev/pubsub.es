import assert from "node:assert";
import { Broker } from "../../../node/index.mjs";

describe("Broker.prototype.publish", () => {
  it("publish(string, any)", async () => {
    const broker = new Broker();

    const topic1 = "t1";
    broker.subscribe(topic1, (data) => {
      throw new Error(data);
    });

    await assert.rejects(async () => {
      await broker.publish(topic1, "t1-data1");
    }, (err) => {
      assert.strictEqual(err.name, "AggregateError");
      assert.strictEqual(err.errors.length, 1);
      assert.strictEqual(err.errors[0].message, "t1-data1");
      return true;
    });

  });

});
