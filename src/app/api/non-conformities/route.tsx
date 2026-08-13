import {NonConformity} from "@/entities/Entities";
import {initializeDataSource} from "@/db/DataSource";
import {PagedResultDto} from "@/PagedResultDto";

export async function POST(request: Request): Promise<Response> {
    const nonConformity = (await request.json()) as NonConformity;
    const dataSource = await initializeDataSource();
    const nonConformityRepository = dataSource.getRepository(NonConformity);

    const newNonConformity = nonConformityRepository.create(nonConformity);
    await nonConformityRepository.save(newNonConformity);

    return new Response(JSON.stringify(newNonConformity), {
        status: 201,
        headers: {'Content-Type': 'application/json'},
    });
}

export async function GET(request: Request): Promise<Response> {
    const dataSource = await initializeDataSource();
    const nonConformityRepository = dataSource.getRepository(NonConformity);

    const url = new URL(request.url);
    const params = url.searchParams;
    const temSurvey = params.has('surveyId') ;
    let surveyId = undefined;
    if (temSurvey) surveyId = params.get('surveyId');

    let query = nonConformityRepository
        .createQueryBuilder('nonConformity')
        .leftJoinAndSelect('nonConformity.question', 'question')
        .leftJoinAndSelect('nonConformity.escalations', 'escalations')
        .leftJoinAndSelect('question.ncClassification', 'ncClassification');

    if (surveyId) {
        query = query.where('question.surveyId = :surveyId', { surveyId})
    }


    const nonConformities = await query
        .addOrderBy('question.order', 'ASC')
        .getMany();

    return new Response(JSON.stringify(new PagedResultDto<NonConformity>(nonConformities.length, nonConformities)), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
    });
}