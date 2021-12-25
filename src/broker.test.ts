import { Broker } from "./broker";

describe("Broker.prototype.clear", () => {
  it("clear()", async () => {
    const broker: Broker<string> = new Broker();

    const t1results1: string[] = [];
    const t1results2: string[] = [];
    const topic1 = "t1";
    const s11 = async (data: string) => {
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

    const t2results1: string[] = [];
    const t2results2: string[] = [];
    const topic2 = "t2";
    const s21 = async (data: string) => {
      t2results1.push(data);
      return;
    };
    const s22 = async (data: string) => {
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

    expect(t1results1.join(",")).toBe(`t1-data1`);
    expect(t1results2.join(",")).toBe(`t1-data2`);
    expect(t2results1.join(",")).toBe(`t2-data1,t2-data2`);
    expect(t2results2.join(",")).toBe(`t2-data2`);

  });

});

describe("Broker.prototype.publish", () => {
  it("publish(string, any)", async () => {
    const broker = new Broker<string>();

    const topic1 = "t1";
    broker.subscribe(topic1, (data: string) => {
      throw new Error(data);
    });

    try {
      await broker.publish(topic1, "t1-data1");
      expect(true).toBe(false);
    }
    catch (err) {
      if (err instanceof AggregateError) {
        expect(err.name).toBe("AggregateError");
        expect(err.errors.length).toBe(1);
        expect(err.errors[0].message).toBe("t1-data1");
      }
      else {
        expect(true).toBe(false);
      }
    }

  });

  it("publish(string, any) - 2", async () => {
    const broker = new Broker<string>();

    const topic1 = "t1";
    broker.subscribe(topic1, (data: string) => {
      throw "ex-err";
    });

    try {
      await broker.publish(topic1, "t1-data1");
      expect(true).toBe(false);
    }
    catch (err) {
      if (err instanceof AggregateError) {
        expect(err.name).toBe("AggregateError");
        expect(err.errors.length).toBe(1);
        expect(err.errors[0].message).toBe("\"ex-err\"");
      }
      else {
        expect(true).toBe(false);
      }
    }

  });

});

describe("Broker.prototype.subscribe", () => {
  it("subscribe(string, Function)", async () => {
    const broker = new Broker<string>();

    const t1results1: string[] = [];
    const t1results2: string[] = [];
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

    const t2results1: string[] = [];
    const t2results2: string[] = [];
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

    expect(t1results1.join(",")).toBe(`t1-data1,t1-data2`);
    expect(t1results2.join(",")).toBe(`t1-data2`);
    expect(t2results1.join(",")).toBe(`t2-data1,t2-data2`);
    expect(t2results2.join(",")).toBe(`t2-data2`);

  });

  it("subscribe(symbol, Function)", async () => {
    const broker = new Broker<string>();

    const t1results1: string[] = [];
    const t1results2: string[] = [];
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

    const t2results1: string[] = [];
    const t2results2: string[] = [];
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

    expect(t1results1.join(",")).toBe(`t1-data1,t1-data2`);
    expect(t1results2.join(",")).toBe(`t1-data2`);
    expect(t2results1.join(",")).toBe(`t2-data1,t2-data2`);
    expect(t2results2.join(",")).toBe(`t2-data2`);

  });

  it("subscribe(string, AsyncFunction)", async () => {
    const broker = new Broker<string>();

    const t1results1: string[] = [];
    const t1results2: string[] = [];
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

    const t2results1: string[] = [];
    const t2results2: string[] = [];
    const topic2 = "t2";
    broker.subscribe(topic2, async (data) => {
      t2results1.push(data);
    });
    await broker.publish(topic2, "t2-data1");
    broker.subscribe(topic2, async (data) => {
      t2results2.push(data);
    });
    await broker.publish(topic2, "t2-data2");

    expect(t1results1.join(",")).toBe(`t1-data1,t1-data2`);
    expect(t1results2.join(",")).toBe(`t1-data2`);
    expect(t2results1.join(",")).toBe(`t2-data1,t2-data2`);
    expect(t2results2.join(",")).toBe(`t2-data2`);

  });

  it("subscribe(string, Function, { once: boolean })", async () => {
    const broker = new Broker<string>();

    const t1results1: string[] = [];
    const t1results2: string[] = [];
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

    const t2results1: string[] = [];
    const t2results2: string[] = [];
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

    expect(t1results1.join(",")).toBe(`t1-data1`);
    expect(t1results2.join(",")).toBe(`t1-data2`);
    expect(t2results1.join(",")).toBe(`t2-data1`);
    expect(t2results2.join(",")).toBe(`t2-data2`);

  });

  it("subscribe(string, Function, { signal: AbortSignal })", async () => {
    const broker = new Broker<string>();

    const t1results1: string[] = [];
    const t1results2: string[] = [];
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

    const t2results1: string[] = [];
    const t2results2: string[] = [];
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

    expect(t1results1.join(",")).toBe(`t1-data1`);
    expect(t1results2.join(",")).toBe(``);
    expect(t2results1.join(",")).toBe(`t2-data1`);
    expect(t2results2.join(",")).toBe(`t2-data2`);

  });

});

describe("Broker.prototype.unsubscribe", () => {
  it("unsubscribe(string, Function)", async () => {
    const broker = new Broker<string>();

    const t1results1: string[] = [];
    const t1results2: string[] = [];
    const topic1 = "t1";
    const s11 = async (data: string) => {
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

    const t2results1: string[] = [];
    const t2results2: string[] = [];
    const topic2 = "t2";
    const s21 = async (data: string) => {
      t2results1.push(data);
    };
    const s22 = async (data: string) => {
      t2results2.push(data);
    };
    broker.subscribe(topic2, s21);
    await broker.publish(topic2, "t2-data1");
    broker.unsubscribe(topic2, s21);
    broker.subscribe(topic2, s22);
    await broker.publish(topic2, "t2-data2");
    broker.unsubscribe(topic2, s22);
    await broker.publish(topic2, "t2-data3");

    expect(t1results1.join(",")).toBe(`t1-data1`);
    expect(t1results2.join(",")).toBe(`t1-data2`);
    expect(t2results1.join(",")).toBe(`t2-data1`);
    expect(t2results2.join(",")).toBe(`t2-data2`);

  });

});
