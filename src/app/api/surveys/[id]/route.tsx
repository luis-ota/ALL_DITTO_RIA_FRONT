import {initializeDataSource} from "@/db/DataSource";
import {Question, Survey} from "@/entities/Entities";

export async function GET(request: Request): Promise<Response> {
    const surveyId = request.url.split('/').pop();
    const dataSource = await initializeDataSource();
    const surveyRepository = dataSource.getRepository(Survey);
    const survey = await surveyRepository.findOneBy({
        id: surveyId
    });

    if (!surveyId) {
        return new Response('', {status: 404});
    }
    return new Response(JSON.stringify(survey), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
    });
}

export async function PUT(request: Request): Promise<Response> {
    const surveyId = request.url.split('/').pop();
    let survey = (await request.json()) as Survey;

    const dataSource = await initializeDataSource();
    const surveyRepository = dataSource.getRepository(Survey);
    const dbSurvey = await surveyRepository.findOneBy({
        id: surveyId
    });
    if (!dbSurvey) {
        return new Response('', {status: 404});
    }

    dbSurvey.update(survey);
    survey = await surveyRepository.save(dbSurvey);

    return new Response(JSON.stringify(survey), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
    });
}

export async function DELETE(request: Request): Promise<Response> {
    const surveyId = request.url.split('/').pop() ?? '';

    const dataSource = await initializeDataSource();
    const surveyRepository = dataSource.getRepository(Survey);
    const result = await surveyRepository.delete(surveyId)


    return new Response('', {
        status: Number(result.affected) > 0 ? 200 : 404,
        headers: {'Content-Type': 'application/json'},
    });
}

export async function POST(request: Request): Promise<Response> {
    const templateId = request.url.split('/').pop() ?? '';

    const dataSource = await initializeDataSource();
    const surveyRepository = dataSource.getRepository(Survey);
    let survey = await surveyRepository.findOne({where: {id: templateId}})

    if (!survey) {
        return new Response('', {
            status: 404,
            headers: {'Content-Type': 'application/json'},
        });
    }

    survey = surveyRepository.create(new Survey(survey));
    survey.template = false;
    await surveyRepository.save(survey);

    const questionsRepository = dataSource.getRepository(Question);
    let questions = await questionsRepository.findBy({surveyId: templateId});

    questions = await Promise.all(
        questions.map(async (question) => {
            const nQuestion = new Question(question);
            nQuestion.surveyId = survey.id;
            return questionsRepository.create(nQuestion);
        })
    );
    await questionsRepository.save(questions);

    return new Response(JSON.stringify(survey), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
    });
}