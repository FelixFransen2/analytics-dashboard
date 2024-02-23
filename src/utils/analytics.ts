import { getDate } from "@/utils";
import { redis } from "@/lib/redis";
import { parse } from "date-fns";

type AnalyticsArgs = {
  retention?: number;
};

type TrackOptions = {
  persist?: boolean;
};

export class Analytics {
  private retention: number = 60 * 60 * 24 * 7;



  constructor(opts?: AnalyticsArgs) {
    if (opts?.retention) {
      this.retention = opts.retention;
    }
  }

  public async track(namespace: string, event: object = {}, opts? : TrackOptions) {
    let key = `analytics::${namespace}`;	

    if (!opts?.persist) {
      key += `::${getDate()}`
    }

    await redis.hincrby(key, JSON.stringify(event), 1);

    if (!opts?.persist) {
      await redis.expire(key, this.retention);
    }

    console.log(`Tracking event: ${namespace}`, event);
  }

  public async retrieve(namespace: string, date: string = getDate()) {
    const res = await redis.hgetall<Record<string, string>>(`analytics::${namespace}`);
    return {
      date,
      events: Object.entries(res ?? []).map(([key, value]) => ({
        [key]: JSON.parse(value)
      })),
    };
  }

  public async retrieveDays(namespace: string, days: number = 7) {
    type AnalyticsPromise = ReturnType<typeof analytics.retrieve>
    const promises: AnalyticsPromise[]  = []

    for (let i = 0; i < days; i++) {
      promises.push(this.retrieve(namespace, getDate(i)));
    }

    const fetched = await Promise.all(promises);
    const data = fetched.sort((a, b) => {
      if(
        parse(a.date, "dd/MM/yyyy", new Date()) > 
        parse(b.date, "dd/MM/yyyy", new Date())
      ) {
        return 1
      } else {
        return -1
      };
    });

    return data;
  }
}

export const analytics = new Analytics();