import {Tab} from "@nextui-org/react";
import {Graph} from "@/app/surveys/[id]/Graph";
import React, {useEffect, useState} from "react";
import {Tabs} from "@nextui-org/tabs";
import {NonConformity, Question} from "@/entities/Entities";
import {getQuestions} from "@/functions/questions";
import {Loading} from "@/components/Lodding";
import {QuestionList} from "@/app/surveys/[id]/questions/QuestionList";
import { NonConformityList } from "./NonConformityList";
import { getNonConfirmities } from "@/functions/nonConformities";

type TabsSurveyProps =  {
    surveysId: string;
    template: boolean;
}

export const TabsSurvey: React.FC<TabsSurveyProps> = ({ surveysId, template, ...props }) => {
    const [ questions, setQuestions ] = useState<Question[]>([]);
    const [ncs, setNcs] = useState<NonConformity[]>([]);
    const [ loaded, setLoaded ] = useState<boolean>(false);

    const getQuestionsFromAPI = async () => {
        const questions = await getQuestions(surveysId);
        setQuestions(questions.items);
    }

    const getNcsFromAPI = async () => {
        const ncs = await getNonConfirmities(surveysId);
        setNcs(ncs.items);
    }

    useEffect(() => {
        getQuestionsFromAPI().then(() => setLoaded(true));
        getNcsFromAPI().then(() => setLoaded(true))
    }, []);


    return (
        <Loading loaded={loaded} >
            <Tabs aria-label="Options" {...props}>
                {
                    template ? <></> : (
                        <Tab key="Stats" title="Stats" className="w-full">
                            <Graph questions={questions}/>
                        </Tab>
                    )
                }
                <Tab key="questions" title="Questions" className="w-full">
                    <QuestionList questions={questions} setQuestions={setQuestions} surveyId={surveysId} />
                </Tab>
                {
                    template ? <></> : (
                        <Tab key="ncs" title="NCs" className="w-full">
                            <NonConformityList ncs={ncs} setNcs={setNcs} ></NonConformityList>
                        </Tab>
                    )
                }
            </Tabs>
        </Loading>
    )
}