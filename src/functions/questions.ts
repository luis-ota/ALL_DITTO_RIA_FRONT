import {Question} from "@/entities/Entities";
import {PagedResultDto} from "@/PagedResultDto";

export async function getQuestions(surveyId: string | undefined = undefined): Promise<PagedResultDto<Question>> {
   let route = 'http://localhost:3000/api/questions';
   if (surveyId) {
      route += `?surveyId=${surveyId}`;
   }

   return await fetch(route)
       .then((res) => res.json() as unknown as PagedResultDto<Question>);
}

export async function updateQuestion(id: string, survey: Question): Promise<Question | null> {
   return await fetch(`http://localhost:3000/api/questions/${id}`, { method: 'PUT', body: JSON.stringify(survey) })
       .then(res =>  res.ok ? res.json() as unknown as Question : null);
}

export async function createQuestion(survey: Question): Promise<Question | null> {
   return await fetch(`http://localhost:3000/api/questions`, { method: 'POST', body: JSON.stringify(survey) })
       .then(res =>  res.ok ? res.json() as unknown as Question : null);
}

export async function deleteQuestion(id: string): Promise<any> {
   return await fetch(`http://localhost:3000/api/questions/${id}`, { method: 'DELETE'});
}