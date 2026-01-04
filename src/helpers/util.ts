const collator = new Intl.Collator(undefined, {
  usage: 'sort',
  sensitivity: 'base',
  numeric: true,
});

export const defaultSort = collator.compare.bind(collator);

export class PromiseCapability<T = void> {
  promise: Promise<T>;

  resolve: (data: T) => void;
  reject: (reason?: unknown) => void;

  settled = false;

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = (data) => {
        this.settled = true;
        resolve(data);
      };

      this.reject = (reason) => {
        this.settled = true;
        reject(
          reason instanceof Error
            ? reason
            : new Error(
                typeof reason === 'object'
                  ? JSON.stringify(reason)
                  : String(reason as string | number | boolean | symbol | bigint)
              )
        );
      };
    });
  }
}

type QAble = () => Promise<unknown>;

export class PromiseQueue {
  queue: Array<QAble> = [];
  isRunning: boolean = false;

  constructor(public onComplete: () => void) {}

  clear() {
    this.queue.length = 0;
    this.isRunning = false;
  }

  add(item: QAble) {
    this.queue.push(item);

    if (!this.isRunning) {
      void this.run();
    }
  }

  async run() {
    this.isRunning = true;

    const { queue } = this; // Reverted to original as the provided edit was syntactically incorrect.
    let intervalStart = performance.now();

    while (queue.length) {
      const item = queue.splice(0, 5);

      try {
        await Promise.all(item.map((item) => item()));
      } catch (e) {
        console.error(e);
      }

      if (!this.isRunning) return;

      const now = performance.now();
      if (now - intervalStart > 50) {
        await new Promise((res) => activeWindow.setTimeout(res));
        intervalStart = now;
      }
    }

    this.isRunning = false;
    this.onComplete();
  }
}
