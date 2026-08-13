'use client'

import {NcClassification, Question} from "@/entities/Entities";
import React, {useEffect, useState} from "react";
import {Button, Table, TableBody, TableHeader, TableRow} from "@nextui-org/react";
import {questionsListsColumns} from "@/app/surveys/[id]/questions/QuestionsListsColumns";
import {QuestionRenderColumn} from "@/app/surveys/[id]/questions/QuestionRenderColumn";
import {QuestionRenderCell} from "@/app/surveys/[id]/questions/QuestionRenderCell";
import {Loading} from "@/components/Lodding";
import {getNcClassificationsList} from "@/functions/classifcations";
import {PlusIcon} from "@/components/PlusIcon";
import {createQuestion, deleteQuestion, updateQuestion} from "@/functions/questions";
import {v4 as uuidv4} from 'uuid';


type QuestionListProps = {
    questions: Question[];
    surveyId: string;
    setQuestions: (q: Question[]) => void;
}

export const QuestionList: React.FC<QuestionListProps> = ({questions, setQuestions, surveyId, }: QuestionListProps) => {
    const [classifications, setClassifications] = useState<NcClassification[]>([]);
    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        getNcClassificationsList().then((e) => {
            setClassifications(e.items);
            setLoaded(true)
        });
    }, []);

    const deleteQuestionOnApi = async (t: Question) => {
        await deleteQuestion(t.id);
        const nQuestions = questions.filter((q: Question) => q.id !== t.id);
        setQuestions([ ...nQuestions ]);
        questions = nQuestions;
    }

    const adicionarQuestion = async () => {
        let novaQuestion: Question | null = {
            surveyId: surveyId,
            order: (questions[questions.length - 1]?.order ?? -1) + 1,
            id: uuidv4(),
            ncClassificationId: null,
        } as Question;

        novaQuestion = await createQuestion(novaQuestion);
        if (novaQuestion) setQuestions([...questions, novaQuestion]);
    }

    const updateQuestionOnApi = async (t: Question) => {
        const question = await updateQuestion(t.id, t);
        if (question) {
            const nQuestions = [...questions];
            const index = nQuestions.findIndex(i => i.id === t.id);
            nQuestions[index] = question;
            setQuestions([...nQuestions]);
        }
    };

    return (
        <>
            <div className="w-full flex justify-center  ">
                <Loading loaded={loaded}>
                    {
                        questions.length <= 0 ? <h1>No data here</h1> : (<>
                            <Table aria-label="Questions">
                                <TableHeader columns={questionsListsColumns}>
                                    {(column) => QuestionRenderColumn(column.key, column.label)}
                                </TableHeader>
                                <TableBody items={questions}>
                                    {(item) => (
                                        <TableRow key={item.id}>
                                            {(columnKey) => QuestionRenderCell({
                                                item,
                                                columnKey: columnKey.toString(),
                                                classifications: classifications,
                                                delete: (t) => {
                                                    deleteQuestionOnApi(t)
                                                },
                                                update: (t) => {
                                                    updateQuestionOnApi(t)
                                                }
                                            })}
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </>)
                    }
                </Loading>
            </div>
            <Button
                className="bg-foreground text-background"
                endContent={<PlusIcon/>}
                size="sm"
                onClick={() => adicionarQuestion()}
            >
                Add New
            </Button>
        </>
    );
}