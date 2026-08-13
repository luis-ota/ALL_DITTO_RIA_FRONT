import {Survey} from "@/entities/Entities";
import {PagedResultDto} from "@/PagedResultDto";

export async function getSurveyById(id: string): Promise<Survey | null> {
   return await fetch(`http://localhost:3000/api/surveys/${id}`)
       .then(res =>  res.ok ? res.json() as unknown as Survey : null);
}

export async function getSurveysList(template?: boolean): Promise<PagedResultDto<Survey>> {
   let url = `http://localhost:3000/api/surveys`;
   if (template !== undefined && template !== null) {
      url += `?template=${template ? 1 : 0}`;
   }

   return await fetch(url)
       .then(res =>  res.json() as unknown as PagedResultDto<Survey>);
}

export async function updateSurvey(id: string, survey: Survey): Promise<Survey | null> {
   return await fetch(`http://localhost:3000/api/surveys/${id}`, { method: 'PUT', body: JSON.stringify(survey) })
       .then(res =>  res.ok ? res.json() as unknown as Survey : null);
}

export async function createSurvey(survey: Survey): Promise<Survey | null> {
   return await fetch(`http://localhost:3000/api/surveys`, { method: 'POST', body: JSON.stringify(survey) })
       .then(res =>  res.ok ? res.json() as unknown as Survey : null);
}

export async function createSurveyFromTemplate(templateId: string): Promise<Survey | null> {
   return await fetch(`http://localhost:3000/api/surveys/${templateId}`, { method: 'POST' })
       .then(res =>  res.ok ? res.json() as unknown as Survey : null);
}

export async function deleteSurvey(id: string): Promise<any> {
   return await fetch(`http://localhost:3000/api/surveys/${id}`, { method: 'DELETE' });
}