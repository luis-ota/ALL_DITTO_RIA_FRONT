import React from "react";
import {TableColumn} from "@nextui-org/react";

export const QuestionRenderColumn = (columnKey: string, columnName: string) => {
    switch (columnKey) {
        case 'description':
            return <TableColumn width={300} key={columnKey}>{columnName}</TableColumn>;
        case 'ncClassificationId':
            return <TableColumn width={250} key={columnKey}>{columnName}</TableColumn>;
        case 'correctiveAction':
            return <TableColumn width={200} key={columnKey}>{columnName}</TableColumn>;
        case 'status':
            return <TableColumn width={160} key={columnKey}>{columnName}</TableColumn>;
        case 'responsible':
            return <TableColumn width={160} key={columnKey}>{columnName}</TableColumn>;
        case 'recurrence':
            return <TableColumn width={30} key={columnKey}>{columnName}</TableColumn>;
        case 'order':
            return <TableColumn width={30} key={columnKey}>{columnName}</TableColumn>;
        case 'artifact':
            return <TableColumn width={100} key={columnKey}>{columnName}</TableColumn>;
        case 'deleteAction':
            return <TableColumn width={30} key={columnKey}>{columnName}</TableColumn>;
        default:
            return <TableColumn key={columnKey}>{columnName}</TableColumn>;
    }
};