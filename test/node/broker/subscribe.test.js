import assert from "node:assert";
import { Broker } from "../../../node/index.mjs";

describe("Broker.prototype.subscribe", () => {
  it("subscribe(string, Function)", async () => {
    const broker = new Broker();

    const t1results1 = [];
    const t1results2 = [];
    const topic1 = "t1";
    broker.subscribe(topic1, (data) => t1results1.push(data));
    await broker.publish(topic1, "t1-data1");
    broker.subscribe(topic1, (data) => t1results2.push(data));
    await broker.publish(topic1, "t1-data2");

    const t2results1 = [];
    const t2results2 = [];
    const topic2 = "t2";
    broker.subscribe(topic2, (data) => t2results1.push(data));
    await broker.publish(topic2, "t2-data1");
    broker.subscribe(topic2, (data) => t2results2.push(data));
    await broker.publish(topic2, "t2-data2");

    assert.strictEqual(t1results1.join(","), `t1-data1,t1-data2`);
    assert.strictEqual(t1results2.join(","), `t1-data2`);
    assert.strictEqual(t2results1.join(","), `t2-data1,t2-data2`);
    assert.strictEqual(t2results2.join(","), `t2-data2`);
  });

  it("subscribe(symbol, Function)", async () => {
    const broker = new Broker();

    const t1results1 = [];
    const t1results2 = [];
    const topic1 = Symbol();
    broker.subscribe(topic1, (data) => t1results1.push(data));
    await broker.publish(topic1, "t1-data1");
    broker.subscribe(topic1, (data) => t1results2.push(data));
    await broker.publish(topic1, "t1-data2");

    const t2results1 = [];
    const t2results2 = [];
    const topic2 = Symbol();
    broker.subscribe(topic2, (data) => t2results1.push(data));
    await broker.publish(topic2, "t2-data1");
    broker.subscribe(topic2, (data) => t2results2.push(data));
    await broker.publish(topic2, "t2-data2");

    assert.strictEqual(t1results1.join(","), `t1-data1,t1-data2`);
    assert.strictEqual(t1results2.join(","), `t1-data2`);
    assert.strictEqual(t2results1.join(","), `t2-data1,t2-data2`);
    assert.strictEqual(t2results2.join(","), `t2-data2`);
  });

  it("subscribe(string, AsyncFunction)", async () => {
    const broker = new Broker();

    const t1results1 = [];
    const t1results2 = [];
    const topic1 = "t1";
    broker.subscribe(topic1, async (data) => t1results1.push(data));
    await broker.publish(topic1, "t1-data1");
    broker.subscribe(topic1, async (data) => t1results2.push(data));
    await broker.publish(topic1, "t1-data2");

    const t2results1 = [];
    const t2results2 = [];
    const topic2 = "t2";
    broker.subscribe(topic2, async (data) => t2results1.push(data));
    await broker.publish(topic2, "t2-data1");
    broker.subscribe(topic2, async (data) => t2results2.push(data));
    await broker.publish(topic2, "t2-data2");

    assert.strictEqual(t1results1.join(","), `t1-data1,t1-data2`);
    assert.strictEqual(t1results2.join(","), `t1-data2`);
    assert.strictEqual(t2results1.join(","), `t2-data1,t2-data2`);
    assert.strictEqual(t2results2.join(","), `t2-data2`);
  });

  it("subscribe(string, Function, { once: boolean })", async () => {
    const broker = new Broker();

    const t1results1 = [];
    const t1results2 = [];
    const topic1 = "t1";
    broker.subscribe(topic1, async (data) => t1results1.push(data), { once: true });
    await broker.publish(topic1, "t1-data1");
    broker.subscribe(topic1, async (data) => t1results2.push(data), { once: true });
    await broker.publish(topic1, "t1-data2");

    const t2results1 = [];
    const t2results2 = [];
    const topic2 = "t2";
    broker.subscribe(topic2, async (data) => t2results1.push(data), { once: true });
    await broker.publish(topic2, "t2-data1");
    broker.subscribe(topic2, async (data) => t2results2.push(data), { once: true });
    await broker.publish(topic2, "t2-data2");

    assert.strictEqual(t1results1.join(","), `t1-data1`);
    assert.strictEqual(t1results2.join(","), `t1-data2`);
    assert.strictEqual(t2results1.join(","), `t2-data1`);
    assert.strictEqual(t2results2.join(","), `t2-data2`);
  });

  it("subscribe(string, Function, { signal: AbortSignal })", async () => {
    const broker = new Broker();

    const t1results1 = [];
    const t1results2 = [];
    const topic1 = "t1";
    const c1 = new AbortController();
    broker.subscribe(topic1, async (data) => t1results1.push(data), { signal: c1.signal });
    await broker.publish(topic1, "t1-data1");
    c1.abort();
    broker.subscribe(topic1, async (data) => t1results2.push(data), { signal: c1.signal });
    await broker.publish(topic1, "t1-data2");

    const t2results1 = [];
    const t2results2 = [];
    const topic2 = "t2";
    const c2 = new AbortController();
    broker.subscribe(topic2, async (data) => t2results1.push(data), { once: true, signal: c2.signal });
    await broker.publish(topic2, "t2-data1");
    broker.subscribe(topic2, async (data) => t2results2.push(data), { once: true, signal: c2.signal });
    await broker.publish(topic2, "t2-data2");
    c2.abort();

    assert.strictEqual(t1results1.join(","), `t1-data1`);
    assert.strictEqual(t1results2.join(","), ``);
    assert.strictEqual(t2results1.join(","), `t2-data1`);
    assert.strictEqual(t2results2.join(","), `t2-data2`);
  });







});
