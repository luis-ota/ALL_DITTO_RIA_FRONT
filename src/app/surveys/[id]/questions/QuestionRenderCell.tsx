import React from "react";
import {
    Button,
    Checkbox,
    getKeyValue,
    Input,
    Select,
    SelectedItemProps,
    SelectedItems,
    SelectItem,
    TableCell,
    Textarea,
    Tooltip
} from "@nextui-org/react";
import {NcClassification} from "@/entities/Entities";
import {QuestionStatus} from "@/enums/QuestionStatus";
import getBestContrastColor from "@/functions/getBestContrastColor";
import {TrashIcon} from "@/components/TrashIcon";
import {QuestionRenderColumnInput} from "@/app/surveys/[id]/questions/QuestionRenderColumnInput"

export const QuestionRenderCell: (props: QuestionRenderColumnInput) => React.JSX.Element = (props: QuestionRenderColumnInput) => {
    const cellValue = getKeyValue(props.item, props.columnKey);

    const atualizar = (valor: any) => {
        const item = { ...props.item } as any;
        item[props.columnKey] = valor;
        props.update(item);
    }

    switch (props.columnKey) {
        case 'status':
            return (
                <TableCell>
                    <Tooltip content={statusOptions.find(f => f.key == QuestionStatus[props.item.status])?.label}>
                        <Select
                            items={statusOptions}
                            label=""
                            placeholder=""
                            className="max-w-xs"
                            defaultSelectedKeys={[QuestionStatus[props.item.status]]}
                            onChange={(q) => atualizar(QuestionStatus[q.target.value])}
                        >
                            {(status) => <SelectItem key={status.key}>{status.label}</SelectItem>}
                        </Select>
                    </Tooltip>
                </TableCell>
            );
        case 'recurrence':
            return <TableCell><Checkbox onValueChange={(q) => atualizar(q)} defaultSelected={cellValue}/></TableCell>;
        case 'ncClassificationId':
            const classificationsOptions = getQuestionsOptions(props.classifications);
            return (
                <TableCell>
                    <Tooltip content={props.item.ncClassification?.name}>
                        <Select
                            items={classificationsOptions}
                            label=""
                            placeholder=""
                            className="max-w-xs"
                            defaultSelectedKeys={[cellValue]}
                            onChange={(q) => atualizar(q.target.value)}
                            renderValue={(v: SelectedItems<SelectedItemProps<string>>) => <div
                                className='p-1 rounded-md'
                                style={{
                                    color: getBestContrastColor(v[0].data?.data ?? ''),
                                    backgroundColor: v[0].data?.data ?? undefined
                                }}>{v[0].textValue}</div>}
                        >
                            {(status) => <SelectItem
                                style={{
                                    backgroundColor: status.data ?? undefined,
                                    color: getBestContrastColor(status.data ?? '')
                                }}
                                key={status.key?.toString() ?? ''}
                            >
                                {status.textValue}
                            </SelectItem>}
                        </Select>
                    </Tooltip>
                </TableCell>
            );
        case 'correctiveAction':
        case 'responsible':
        case 'artifact':
            return <TableCell><Tooltip content={cellValue}><Input onChange={(q) => atualizar(q.target.value)} value={cellValue}/></Tooltip></TableCell>;
        case 'description':
            return <TableCell><Tooltip content={cellValue}>
                <Textarea
                    defaultValue={cellValue}
                    className="max-w-xs"
                    onChange={(q) => atualizar(q.target.value)}
                />
            </Tooltip></TableCell>;
        case 'notes':
            return <TableCell><Tooltip className="w-full" content={cellValue}>
                <Textarea
                    defaultValue={cellValue}
                    className="w-full"
                    onChange={(q) => atualizar(q.target.value)}
                />
            </Tooltip></TableCell>;
        case 'deleteAction':
            return (
                <TableCell>
                    <Button
                        isIconOnly
                        fullWidth={false}
                        className="z-50"
                        onClick={() => props.delete(props.item)}
                    >
                        <TrashIcon
                            width={20}
                            height={20}
                            color={"#c41e3d"}
                        />
                    </Button>
                </TableCell>
            )
        default:
            return <TableCell><p>{cellValue != null ? cellValue.toString() : ''}</p></TableCell>;
    }
};

const getQuestionsOptions = (classification: NcClassification[]) => {
    return classification.map((item: NcClassification) => {
        return {
            key: item.id,
            textValue: `${item.name} | ${item.daysToResolve}`,
            data: item.color
        } as SelectedItemProps<string>;
    });
}

const statusOptions = [
    {key: QuestionStatus[QuestionStatus.Empty], label: '-'},
    {key: QuestionStatus[QuestionStatus.Ok], label: 'Conforme'},
    {key: QuestionStatus[QuestionStatus.NotOk], label: 'Não conforme'},
    {key: QuestionStatus[QuestionStatus.NotApplicable], label: 'Não aplicável'}
];