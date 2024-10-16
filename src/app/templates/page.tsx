"use client";

import {PagedResultDto} from "@/PagedResultDto";
import {Survey} from "@/entities/Entities";
import {getKeyValue, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/react";
import {useEffect, useState} from "react";

export default function Home() {
    const [data, setData] = useState<PagedResultDto<Survey> | null>(null)
    const [isLoading, setLoading] = useState(true)

    const columns = [
        {
            key: "name",
            label: "Name",
        },
    ];

    useEffect(() => {
        fetch('http://localhost:3000/api/surveys?template=1')
            .then((res) => res.json())
            .then((data) => {
                setData(data)
                setLoading(false)
            })
    }, [])

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start min-w-fullmin-w-full">
                {isLoading ? (<h1>Loading..</h1>) : (
                    <Table aria-label="Example table with dynamic content">
                        <TableHeader columns={columns}>
                            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                        </TableHeader>
                        <TableBody items={data?.items}>
                            {(item) => (
                                <TableRow key={item.id} onClick={() => { console.log("OIT") }} style={{ cursor: "pointer" }}>
                                    {(columnKey) => <TableCell><p>{getKeyValue(item, columnKey)}</p></TableCell>}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </main>
        </div>
    );
}
