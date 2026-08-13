import {Escalation} from "@/entities/Entities";

export async function createEscalation(escalation: Escalation): Promise<Escalation | null> {
    return await fetch(`http://localhost:3000/api/escalations`, { method: 'POST', body: JSON.stringify(escalation) })
        .then(res =>  res.ok ? res.json() as unknown as Escalation : null);
}