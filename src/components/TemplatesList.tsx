import {Survey} from "@/entities/Entities";
import React, {useEffect, useState} from "react";
import {PagedResultDto} from "@/PagedResultDto";
import {Loading} from "@/components/Lodding";
import {Button, getKeyValue, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/react";
import {deleteSurvey, getSurveysList} from "@/functions/surveys";
import {TrashIcon} from "@/components/TrashIcon";

type TemplatesListProps = {
    clickAction: (s: Survey) => void;
    hasDeleteAction?: boolean;
}

export const TemplatesList: React.FC<TemplatesListProps> = ({ clickAction, hasDeleteAction }: TemplatesListProps) => {
    const [data, setData] = useState<PagedResultDto<Survey> | null>(null)
    const [isLoading, setLoading] = useState(true)

    const columns = [
        {
            key: "name",
            label: "Name",
        }
    ];
    if (hasDeleteAction) {
        columns.push({
            key: "trash",
            label: "Delete",
        });
    }

    const getSurveysListOnAPI = async () => {
        const data = await getSurveysList(true);
        setData(data)
        setLoading(false)
    }

    const deleteSurveyOnAPI = async (item: Survey) => {
        await deleteSurvey(item.id);
        await getSurveysListOnAPI();
    }

    useEffect(() => {
        getSurveysListOnAPI().then();
    }, []);

    const renderCell = React.useCallback((item: Survey, columnKey: string) => {
        const cellValue = getKeyValue(item, columnKey);
        switch (columnKey) {
            case 'name':
                return (
                    <p className="">
                        { cellValue }
                    </p>
                );
            case 'trash':
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <Button isIconOnly onClick={() => deleteSurveyOnAPI(item)} fullWidth={false} className="z-50" > <TrashIcon width={20} height={20} color={"#c41e3d"} />  </Button>
                    </div>
                )
            default:
                return cellValue;
        }
    }, [])

    return (
        <Loading loaded={!isLoading}>
            <Table aria-label="Example table with dynamic content">
                <TableHeader columns={columns}>
                    {(column) => <TableColumn width={column.key !== 'trash' ? `100%` : undefined} key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody items={data?.items}>
                    {(item) => (
                        <TableRow key={item.id} onClick={() => { clickAction(item) }} className={"table-row"}>
                            {(columnKey) => (<TableCell>{ renderCell(item, columnKey.toString()) }</TableCell>)
                            }
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Loading>
    )
}