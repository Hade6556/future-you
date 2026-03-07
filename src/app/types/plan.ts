export type IntakePath = {
  name: string;
  description: string;
  timeHorizon: string;
  tradeoffs: string;
};

export type IntakeResponse = {
  values: string[];
  roles: string[];
  paths: IntakePath[];
};

export type AmbitionDomain =
  | "entrepreneur"
  | "athlete"
  | "weight_loss"
  | "creative"
  | "student"
  | "wellness";

export type ArchetypeId =
  | "steady"
  | "strategist"
  | "endurance"
  | "creative"
  | "guardian"
  | "explorer";

export type QuizAnswer = string | number | number[] | null;
