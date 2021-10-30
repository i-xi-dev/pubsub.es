import assert from "node:assert";
import { Broker } from "../../../node/index.mjs";

describe("Broker.prototype.unsubscribe", () => {
  it("unsubscribe(string, Function)", async () => {
    const broker = new Broker();

    const t1results1 = [];
    const t1results2 = [];
    const topic1 = "t1";
    const s11 = async (data) => t1results1.push(data);
    broker.subscribe(topic1, s11);
    await broker.publish(topic1, "t1-data1");
    broker.unsubscribe(topic1, s11);
    broker.subscribe(topic1, async (data) => t1results2.push(data));
    await broker.publish(topic1, "t1-data2");

    const t2results1 = [];
    const t2results2 = [];
    const topic2 = "t2";
    const s21 = async (data) => t2results1.push(data);
    const s22 = async (data) => t2results2.push(data);
    broker.subscribe(topic2, s21);
    await broker.publish(topic2, "t2-data1");
    broker.unsubscribe(topic2, s21);
    broker.subscribe(topic2, s22);
    await broker.publish(topic2, "t2-data2");
    broker.unsubscribe(topic2, s22);
    await broker.publish(topic2, "t2-data3");

    assert.strictEqual(t1results1.join(","), `t1-data1`);
    assert.strictEqual(t1results2.join(","), `t1-data2`);
    assert.strictEqual(t2results1.join(","), `t2-data1`);
    assert.strictEqual(t2results2.join(","), `t2-data2`);
  });


});
