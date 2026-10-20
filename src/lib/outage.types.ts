export type QueueLink = {
  name: string;
  slug: string;
};

export type SlotView = {
  from: string;
  to: string;
  duration: string;
  startMin: number;
  endMin: number;
  current: boolean;
  upcoming: boolean;
};

export type PowerView = {
  mode: "on" | "off" | "clear";
  from: number;
  to: number;
  label: string;
};

export type DayView = {
  offLabel: string;
  onLabel: string;
  list: SlotView[];
};

export type QueuePageData = {
  queueName: string;
  queueSlug: string;
  today: DayView;
  tomorrow: DayView;
  power: PowerView;
};
