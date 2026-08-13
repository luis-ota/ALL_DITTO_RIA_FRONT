"use client";

import {PagedResultDto} from "@/PagedResultDto";
import {Survey} from "@/entities/Entities";
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    getKeyValue,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    useDisclosure
} from "@nextui-org/react";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import {format} from "date-fns";
import {useRouter} from "next/navigation";
import {PlusIcon} from "@/components/PlusIcon";
import {Loading} from "@/components/Lodding";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import {TemplatesList} from "@/components/TemplatesList";
import {createSurveyFromTemplate} from "@/functions/surveys";

export default function Home() {
    const [data, setData] = useState<PagedResultDto<Survey> | null>(null)
    const [isLoading, setLoading] = useState(true)
    const router = useRouter();
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const columns = [
        {
            key: "name",
            label: "Name",
        },
        {
            key: "date",
            label: "Date",
        },
        {
            key: "responsible",
            label: "Responsible",
        },
        {
            key: "objectName",
            label: "Object Name",
        }
    ];

    useEffect(() => {
        fetch('http://localhost:3000/api/surveys?template=0')
            .then((res) => res.json())
            .then((data) => {
                setData(data)
                setLoading(false)
            })
    }, [])

    return (
        <div
            className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start min-w-full">
                <Loading loaded={!isLoading}>
                    <Table aria-label="Example table with dynamic content">
                        <TableHeader columns={columns}>
                            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                        </TableHeader>
                        <TableBody items={data?.items}>
                            {(item) => (
                                <TableRow key={item.id} onClick={() => {
                                    router.push('surveys/' + item.id)
                                }} className={"table-row"}>
                                    {(columnKey) => columnKey != "objectName"
                                        ? (<TableCell><p>{
                                            columnKey == 'date'
                                                ? format(getKeyValue(item, columnKey), 'MM/dd/yyyy')
                                                : getKeyValue(item, columnKey)
                                        }</p></TableCell>)
                                        : (<TableCell><Link className="link"
                                                            href={item.objectUrl ?? ""}>{getKeyValue(item, columnKey)}</Link></TableCell>)
                                    }
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <Dropdown className="bg-background border-1 border-default-200">
                        <DropdownTrigger>
                            <Button
                                className="bg-foreground text-background"
                                endContent={<PlusIcon/>}
                                size="sm"
                            >
                                Add New
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                            <DropdownItem onClick={() => router.push('surveys/new')}>Empty</DropdownItem>
                            <DropdownItem onClick={onOpen} >From template</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </Loading>
            </main>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Select a template</ModalHeader>
                            <ModalBody>
                                <TemplatesList clickAction={async (t) => {
                                    const survey = await createSurveyFromTemplate(t.id)
                                    onClose();
                                    if (survey) {
                                        router.push('surveys/' + survey.id)
                                    }
                                }} />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
