"use client";

import {Loading} from "@/components/Lodding";
import React, {useEffect, useState} from "react";
import {Survey} from "@/entities/Entities";
import {getSurveyById} from "@/functions/surveys";
import {SurveyComponent} from "@/app/surveys/[id]/SurveyForm";
import {useRouter, useSearchParams} from "next/navigation";
import {TabsSurvey} from "@/app/surveys/[id]/Tabs";
import {QuestionList} from "@/app/surveys/[id]/questions/QuestionList";

interface SurveyProps {
    params: { id: string };
}

export default function SurveyPage({params}: SurveyProps) {
    const [loaded, setLoaded] = useState(false);
    const [editing, setEditing] = useState(false);
    const [survey, setSurvey] = useState<Survey>();
    const router = useRouter();
    const searchParams = useSearchParams();

    const reload = (s: Survey) => {
        if (!editing) router.push('/surveys/' + s.id);
        setEditing(true);
        setSurvey(s);
    }

    useEffect(() => {
        if (params.id != 'new') {
            getSurveyById(params.id)
                .then(s => {
                    if (s) {
                        setSurvey(s);
                        setEditing(true);
                        setLoaded(true);
                    }
                });
        } else {
            setSurvey({
                template: searchParams.get("template") === '1',
            } as Survey);
            setLoaded(true);
        }
    }, []);


    return (
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start min-w-full p-10 w-">
            <Loading loaded={loaded}>
                <h1>{survey?.name}</h1>
                {
                    survey ?
                        <SurveyComponent updating={editing} survey={survey} reload={reload}></SurveyComponent> : <></>
                }
                {
                    !editing || !survey ? <></> : <TabsSurvey template={survey.template} surveysId={survey.id}/>
                }
            </Loading>
        </main>
    )
}