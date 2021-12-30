import assert from "node:assert";
import { Broker } from "../../dist/index.js";

describe("Broker.prototype.clear", () => {
  it("clear()", async () => {
    const broker = new Broker();

    const t1results1 = [];
    const t1results2 = [];
    const topic1 = "t1";
    const s11 = async (data) => {
      t1results1.push(data);
      return;
    };
    broker.subscribe(topic1, s11);
    await broker.publish(topic1, "t1-data1");
    broker.clear();
    broker.subscribe(topic1, async (data) => {
      t1results2.push(data);
      return;
    });
    await broker.publish(topic1, "t1-data2");

    const t2results1 = [];
    const t2results2 = [];
    const topic2 = "t2";
    const s21 = async (data) => {
      t2results1.push(data);
      return;
    };
    const s22 = async (data) => {
      t2results2.push(data);
      return;
    };
    broker.subscribe(topic2, s21);
    await broker.publish(topic2, "t2-data1");
    //broker.clear();
    broker.subscribe(topic2, s22);
    await broker.publish(topic2, "t2-data2");
    broker.clear();
    await broker.publish(topic2, "t2-data3");

    assert.strictEqual(t1results1.join(","), `t1-data1`);
    assert.strictEqual(t1results2.join(","), `t1-data2`);
    assert.strictEqual(t2results1.join(","), `t2-data1,t2-data2`);
    assert.strictEqual(t2results2.join(","), `t2-data2`);

  });

});

describe("Broker.prototype.publish", () => {
  it("publish(string, any)", async () => {
    const broker = new Broker();

    const topic1 = "t1";
    broker.subscribe(topic1, (data) => {
      throw new Error(data);
    });

    try {
      await broker.publish(topic1, "t1-data1");
      assert.strictEqual(true, false);
    }
    catch (err) {
      if (err instanceof AggregateError) {
        assert.strictEqual(err.name, "AggregateError");
        assert.strictEqual(err.errors.length, 1);
        assert.strictEqual(err.errors[0].message, "t1-data1");
      }
      else {
        assert.strictEqual(true, false);
      }
    }

  });

  it("publish(string, any) - 2", async () => {
    const broker = new Broker();

    const topic1 = "t1";
    broker.subscribe(topic1, (data) => {
      throw "ex-err";
    });

    try {
      await broker.publish(topic1, "t1-data1");
      assert.strictEqual(true, false);
    }
    catch (err) {
      if (err instanceof AggregateError) {
        assert.strictEqual(err.name, "AggregateError");
        assert.strictEqual(err.errors.length, 1);
        assert.strictEqual(err.errors[0].message, "\"ex-err\"");
      }
      else {
        assert.strictEqual(true, false);
      }
    }

  });

});

describe("Broker.prototype.subscribe", () => {
  it("subscribe(string, Function)", async () => {
    const broker = new Broker();

    const t1results1 = [];
    const t1results2 = [];
    const topic1 = "t1";
    broker.subscribe(topic1, async (data) => {
      t1results1.push(data);
      return;
    });
    await broker.publish(topic1, "t1-data1");
    broker.subscribe(topic1, async (data) => {
      t1results2.push(data);
      return;
    });
    await broker.publish(topic1, "t1-data2");

    const t2results1 = [];
    const t2results2 = [];
    const topic2 = "t2";
    broker.subscribe(topic2, async (data) => {
      t2results1.push(data);
      return;
    });
    await broker.publish(topic2, "t2-data1");
    broker.subscribe(topic2, async (data) => {
      t2results2.push(data);
      return;
    });
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
    broker.subscribe(topic1, async (data) => {
      t1results1.push(data);
      return;
    });
    await broker.publish(topic1, "t1-data1");
    broker.subscribe(topic1, async (data) => {
      t1results2.push(data);
      return;
    });
    await broker.publish(topic1, "t1-data2");

    const t2results1 = [];
    const t2results2 = [];
    const topic2 = Symbol();
    broker.subscribe(topic2, async (data) => {
      t2results1.push(data);
      return;
    });
    await broker.publish(topic2, "t2-data1");
    broker.subscribe(topic2, async (data) => {
      t2results2.push(data);
      return;
    });
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
    broker.subscribe(topic1, async (data) => {
      t1results1.push(data);
      return;
    });
    await broker.publish(topic1, "t1-data1");
    broker.subscribe(topic1, async (data) => {
      t1results2.push(data);
      return;
    });
    await broker.publish(topic1, "t1-data2");

    const t2results1 = [];
    const t2results2 = [];
    const topic2 = "t2";
    broker.subscribe(topic2, async (data) => {
      t2results1.push(data);
    });
    await broker.publish(topic2, "t2-data1");
    broker.subscribe(topic2, async (data) => {
      t2results2.push(data);
    });
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
    broker.subscribe(topic1, async (data) => {
      t1results1.push(data);
      return;
    }, { once: true });
    await broker.publish(topic1, "t1-data1");
    broker.subscribe(topic1, async (data) => {
      t1results2.push(data);
      return;
    }, { once: true });
    await broker.publish(topic1, "t1-data2");

    const t2results1 = [];
    const t2results2 = [];
    const topic2 = "t2";
    broker.subscribe(topic2, async (data) => {
      t2results1.push(data);
      return;
    }, { once: true });
    await broker.publish(topic2, "t2-data1");
    broker.subscribe(topic2, async (data) => {
      t2results2.push(data);
      return;
    }, { once: true });
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
    broker.subscribe(topic1, async (data) => {
      t1results1.push(data);
      return;
    }, { signal: c1.signal });
    await broker.publish(topic1, "t1-data1");
    c1.abort();
    broker.subscribe(topic1, async (data) => {
      t1results2.push(data);
      return;
    }, { signal: c1.signal });
    await broker.publish(topic1, "t1-data2");

    const t2results1 = [];
    const t2results2 = [];
    const topic2 = "t2";
    const c2 = new AbortController();
    broker.subscribe(topic2, async (data) => {
      t2results1.push(data);
      return;
    }, { once: true, signal: c2.signal });
    await broker.publish(topic2, "t2-data1");
    broker.subscribe(topic2, async (data) => {
      t2results2.push(data);
      return;
    }, { once: true, signal: c2.signal });
    await broker.publish(topic2, "t2-data2");
    c2.abort();
    await broker.publish(topic2, "t2-data3");

    assert.strictEqual(t1results1.join(","), `t1-data1`);
    assert.strictEqual(t1results2.join(","), ``);
    assert.strictEqual(t2results1.join(","), `t2-data1`);
    assert.strictEqual(t2results2.join(","), `t2-data2`);

  });

});

describe("Broker.prototype.unsubscribe", () => {
  it("unsubscribe(string, Function)", async () => {
    const broker = new Broker();

    const t1results1 = [];
    const t1results2 = [];
    const topic1 = "t1";
    const s11 = async (data) => {
      t1results1.push(data);
    };
    broker.subscribe(topic1, s11);
    broker.subscribe(topic1, s11);
    await broker.publish(topic1, "t1-data1");
    broker.unsubscribe(topic1, s11);
    broker.subscribe(topic1, async (data) => {
      t1results2.push(data);
    });
    await broker.publish(topic1, "t1-data2");

    const t2results1 = [];
    const t2results2 = [];
    const topic2 = "t2";
    const s21 = async (data) => {
      t2results1.push(data);
    };
    const s22 = async (data) => {
      t2results2.push(data);
    };
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
