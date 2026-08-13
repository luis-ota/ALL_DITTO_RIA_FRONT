import React, {useEffect, useState} from "react";
import {Survey} from "@/entities/Entities";
import {Button, DatePicker, Input} from "@nextui-org/react";
import {CalendarDate, parseDate, getLocalTimeZone} from "@internationalized/date";
import {createSurvey, updateSurvey} from "@/functions/surveys";

type SurveyFormProps = React.ComponentProps<'div'> & {
    survey: Survey;
    updating: boolean;
    reload?: (e: Survey) => void;
}

export const SurveyComponent: React.FC<SurveyFormProps> = ({survey, updating, reload, ...props}) => {
    const defaultDatetime = survey.date == null ? null : parseDate(survey.date?.toString().split('T')[0]);

    const [name, setName] = useState<string>(survey.name ?? '');
    const [objectName, setObjectName] = useState<string>(survey.objectName ?? '');
    const [objectUrl, setObjectUrl] = useState<string>(survey.objectUrl ?? '');
    const [date, setDate] = useState<CalendarDate | null>(defaultDatetime);
    const [responsible, setResponsible] = useState<string>(survey.responsible ?? '');

    const [canSave, setCanSave] = useState<boolean>(false);

    const validCanSave = () => {
        const hasName = Boolean(name);
        const hasObjectName = Boolean(objectName);
        const hasObjectUrl = Boolean(objectUrl);
        const hasDate = Boolean(date);
        const hasResponsible = Boolean(responsible);

        const canSaveTemplate = hasName;
        const canSaveSurvey = hasObjectName && hasResponsible && hasObjectUrl && hasDate && hasName;

        return survey.template ? canSaveTemplate : canSaveSurvey;
    };

    const resetForm = (s: Survey) => {
        survey = s;
        const defaultDatetime = survey.date == null ? null : parseDate(survey.date?.toString().split('T')[0]);

        setName(survey.name);
        setObjectName(survey.objectName ?? '');
        setObjectUrl(survey.objectUrl ?? '');
        setDate(defaultDatetime);
        setResponsible(survey.responsible ?? '');
        setCanSave(false);
    }

    const save = () => {
        if (!canSave) return false;

        const surveyModel = {...survey} as Survey;
        surveyModel.name = name;
        surveyModel.date = date?.toDate(getLocalTimeZone());
        surveyModel.objectName = objectName;
        surveyModel.objectUrl = objectUrl;
        surveyModel.responsible = responsible;

        const request = updating
            ? updateSurvey(surveyModel.id, surveyModel)
            : createSurvey(surveyModel)

        request.then(s => {
            if (s) {
                resetForm(s);
                if (reload) reload(s);
            }
        })
    };

    useEffect(() => {
        setCanSave(validCanSave());
    }, [name, objectName, date, responsible, objectUrl]);

    return (
        <div className="w-full gap-2 flex flex-col justify-start" {...props}>
            <form className="w-full gap-4 flex justify-around items-end">
                <Input label="Nome" value={name} onChange={(e) => {
                    setName(e.target.value)
                }}/>
                {
                    survey.template ? <></> :
                        (
                            <>
                                <Input label="Responsible" value={responsible} onChange={(e) => {
                                    setResponsible(e.target.value)
                                }}/>
                                <Input label="Object Name" value={objectName} onChange={(e) => {
                                    setObjectName(e.target.value)
                                }}/>
                                <Input label="Object URL" type="url" value={objectUrl} onChange={(e) => {
                                    setObjectUrl(e.target.value)
                                }}/>
                                <DatePicker
                                    label="Date"
                                    variant="bordered"
                                    hideTimeZone
                                    defaultValue={date}
                                    showMonthAndYearPickers
                                    onChange={(e) => {
                                        setDate(e)
                                    }}
                                />
                            </>
                        )
                }
            </form>
            <Button isDisabled={!canSave} className="w-fit" color="primary" onClick={save}>Save</Button>
        </div>
    );
}