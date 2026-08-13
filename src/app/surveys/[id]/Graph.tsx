"use client";

import {Doughnut} from "react-chartjs-2";
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from 'chart.js';
import {NcClassification, Question} from "@/entities/Entities";
import {QuestionStatus} from "@/enums/QuestionStatus";
import getBestContrastColor from "@/functions/getBestContrastColor";

ChartJS.register(ArcElement, Tooltip, Legend);

function setColorAderencia(number: number) {
    if (number <= 60) {
        return '#b84142'
    }
    if (number >= 61 && number <= 90) {
        return '#fae39c'
    }
    return '#57bb8a'
}

type GraphProps = {
    questions: Question[],
}

export const Graph: React.FC<GraphProps> = ({questions}) => {

    let classifications = questions
        .filter(q => q.ncClassification != null && q.status == QuestionStatus.NotOk)
        .map((question) => question.ncClassification as NcClassification)

    classifications = classifications
        .filter((item, index) => classifications.findIndex(i => i?.id == item?.id) === index)
        .sort((a, b) => a.order - b.order);

    const labels = classifications.map(q => q.name);
    const colors = classifications.map(q => q.color);

    const classificationsCount: { [key: string]: number } = questions
        .filter(q => q.ncClassification != null && q.status == QuestionStatus.NotOk)
        .reduce((acc: { [key: string]: number }, item) => {
        if (item.ncClassificationId == undefined) return acc;

        if (!acc[item.ncClassificationId]) {
            acc[item.ncClassificationId] = 0;
        }

        acc[item.ncClassificationId]++;
        return acc;
    }, {});

    const values = classifications.map(classification => classificationsCount[classification.id] ?? 0);

    const data = {
        labels: labels,
        datasets: [
            {
                label: '',
                data: values,
                backgroundColor: colors,
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
    };

    const totalQuestionsValid = questions.filter(q => q.status == QuestionStatus.Ok || q.status == QuestionStatus.NotOk).length;
    const totalOk = questions.filter(q => q.status == QuestionStatus.Ok).length;
    const aderencia = totalOk / totalQuestionsValid * 100;

    const empty = questions.length <= 0;

    return (
        <div className='flex items-center justify-evenly p-32 w-full'>
            {
                empty ? <p className="font-bold text-inherit"> No data here </p> :
                    <>
                        <div className='w-1/2 h-full flex flex-col items-center justify-evenly gap-10 '>
                            <div
                                className='bg-gray-500 px-10 gap-4 py-5 rounded-2xl shadow-md w-full flex items-center justify-center flex-col'>
                                {
                                    labels.map((label, i) => (
                                        <div className='flex items-center gap-16 font-bold justify-between w-full'>
                                            <p style={{
                                                backgroundColor: colors[i],
                                                color: getBestContrastColor(colors[i])
                                            }}
                                               className="p-0.5 rounded-md w-4/5">{label}</p>
                                            <p className="w-1/5">{values[i]}</p>
                                        </div>

                                    ))
                                }
                            </div>

                            <div
                                className='bg-gray-500 px-16 py-5 rounded-2xl shadow-md w-full flex items-center justify-center'>

                                <div className='flex items-center gap-5 justify-between font-bold'>
                                    <p>Aderencia</p>
                                    <p style={{
                                        backgroundColor: setColorAderencia(isNaN(aderencia) ? 0 : aderencia),
                                        color: getBestContrastColor(setColorAderencia(isNaN(aderencia) ? 0 : aderencia))
                                    }}
                                       className="p-0.5 rounded-md w-4/5">{(isNaN(aderencia) ? 0 :  aderencia.toFixed(2))}%</p>
                                </div>

                            </div>
                        </div>

                        <div className="w-fit h-56">
                            <Doughnut data={data} options={options}/>
                        </div>
                    </>
            }
        </div>

    );
}
