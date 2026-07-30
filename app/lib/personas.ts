import scarletGuardian from "@/config/personas/scarlet-guardian.json";

export type ScarletPersona = {
  id: string;
  name: string;
  ownerEmail: string;
  site: string;
  profile: {
    targetAudience: string;
    desiredImpression: string;
    avoidImpression: string;
    preferredLanguage: string;
  };
  voice: {
    personality: string[];
    tone: string[];
    styleRules: string[];
  };
  operations: {
    publicDomain: string;
    workerName: string;
    databaseName: string;
    parentDomainAccount: string;
  };
};

const personas = {
  [scarletGuardian.id]: scarletGuardian,
} satisfies Record<string, ScarletPersona>;

export function getPersona(id = "scarlet-guardian") {
  return personas[id] ?? personas["scarlet-guardian"];
}

export function personaSummary(persona: ScarletPersona) {
  return [
    `${persona.name} / ${persona.site}`,
    `Owner: ${persona.ownerEmail}`,
    `Audience: ${persona.profile.targetAudience}`,
    `Voice: ${persona.voice.personality.join(", ")}`,
  ].join("\n");
}
