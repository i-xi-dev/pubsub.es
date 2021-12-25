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

//expect().toBe();