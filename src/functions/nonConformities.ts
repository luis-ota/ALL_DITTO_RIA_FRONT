import {NonConformity} from "@/entities/Entities";
import {PagedResultDto} from "@/PagedResultDto";

export async function getNonConfirmities(surveyId: string | undefined = undefined): Promise<PagedResultDto<NonConformity>> {
    let route = 'http://localhost:3000/api/non-conformities';
    if (surveyId) {
        route += `?surveyId=${surveyId}`;
    }
    return await fetch(route)
        .then((res) => res.json() as unknown as PagedResultDto<NonConformity>);
}

export async function updateNC(id: string, nc: NonConformity): Promise<NonConformity | null> {
    return await fetch(`http://localhost:3000/api/non-conformities/${id}`, {method: 'PUT', body: JSON.stringify(nc)})
        .then(res => res.ok ? res.json() as unknown as NonConformity : null);
}