import {initializeDataSource} from "@/db/DataSource";
import {NonConformity, Question} from "@/entities/Entities";
import {QuestionStatus} from "@/enums/QuestionStatus";

export async function GET(request: Request): Promise<Response> {
    const questionId = request.url.split('/').pop();
    const dataSource = await initializeDataSource();
    const questionRepository = dataSource.getRepository(Question);
    const question = await questionRepository.findOne({
        where: {
            id: questionId,
        },
        relations: ['ncClassification']
    });

    if (!questionId) {
        return new Response('', { status: 404 });
    }
    return new Response(JSON.stringify(question), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
    });
}

export async function PUT(request: Request): Promise<Response> {
    const questionId = request.url.split('/').pop();
    let question = (await request.json()) as Question;


    const dataSource = await initializeDataSource();
    const questionRepository = dataSource.getRepository(Question);
    const dbQuestion = await questionRepository.findOneBy({
        id: questionId
    });
    if (!dbQuestion) {
        return new Response('', { status: 404 });
    }

    let mudouConformidade = question.status === QuestionStatus.NotOk && dbQuestion.status !== question.status;

    dbQuestion.update(question);
    question = await questionRepository.save(dbQuestion);

    if (mudouConformidade) {
        const ncRepository = dataSource.getRepository(NonConformity);

        const alreadyHas = await ncRepository.countBy({ questionId: question.id });
        if (alreadyHas <= 0) {
            const nc = new NonConformity();
            nc.questionId = question.id;
            ncRepository.create(nc);
            await ncRepository.save(nc);
        }

    }

    return new Response(JSON.stringify(question), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
    });
}

export async function DELETE(request: Request): Promise<Response> {
    const questionId = request.url.split('/').pop() ?? '';

    const dataSource = await initializeDataSource();
    const questionRepository = dataSource.getRepository(Question);
    const result = await questionRepository.delete(questionId)


    return new Response('', {
        status: Number(result.affected) > 0 ?  200: 404,
        headers: {'Content-Type': 'application/json'},
    });
}