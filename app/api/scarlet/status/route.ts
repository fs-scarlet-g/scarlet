import { getPersona } from "@/app/lib/personas";

export const dynamic = "force-dynamic";

export function GET() {
  const persona = getPersona();

  return Response.json(
    {
      service: "scarlet-guardian",
      status: "ok",
      site: persona.operations.publicDomain,
      worker: persona.operations.workerName,
      database: persona.operations.databaseName,
      parentDomainManagedBy: persona.operations.parentDomainAccount,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
