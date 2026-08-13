"use client";

import {PagedResultDto} from "@/PagedResultDto";
import {NcClassification} from "@/entities/Entities";
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
import "./page.css";
import getBestContrastColor from "@/functions/getBestContrastColor";
import {VerticalDotsIcon} from "@/components/VerticalDotsIcon";
import {PlusIcon} from "@/components/PlusIcon";
import {useRouter} from "next/navigation";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import {Loading} from "@/components/Lodding";

export default function Classification() {
    const [data, setData] = useState<PagedResultDto<NcClassification> | null>(null);
    const [isLoading, setLoading] = useState(true);
    const router = useRouter();

    const {isOpen, onOpen, onOpenChange} = useDisclosure();


    const columns = [
        {
            key: 'name',
            label: "Classification",
        },
        {
            key: 'actions',
            label: "Actions",
        },
    ];

    const buscarItens = () => {
        setLoading(true)
        fetch('http://localhost:3000/api/nc-classifications')
            .then((res) => res.json())
            .then((data) => {
                setData(data)
                setLoading(false)
            })
    };

    const deleteClassification = (item: NcClassification) => {
        fetch(`http://localhost:3000/api/nc-classifications/${item.id}`, { method: "DELETE" })
            .then((r) => {
                if (r.ok) buscarItens();
                else onOpen();
            });
    };

    useEffect(() => {
        buscarItens();
    }, []);

    const renderCell = React.useCallback((item: NcClassification, columnKey: string) => {
        const cellValue = getKeyValue(item, columnKey);
        switch (columnKey) {
            case 'name':
                return (
                    <div
                    className={'classification-column'}
                    style={{
                        backgroundColor: item.color,
                        color: getBestContrastColor(item.color)
                    }}>
                        <p> {item.name} | {item.daysToResolve} </p>
                    </div>
                );
            case 'actions':
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <Dropdown className="bg-background border-1 border-default-200">
                            <DropdownTrigger>
                                <Button isIconOnly radius="full" size="sm" variant="light">
                                    <VerticalDotsIcon className="text-default-400"/>
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem onClick={() => deleteClassification(item)}>Delete</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                )
            default:
                return cellValue;
        }
    }, [])

    return ( <>
        <div
            className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-start min-w-full">
                <h1>NC Classifications</h1>
                <Loading loaded={!isLoading}>
                    <Table aria-label="Example table with dynamic content">
                        <TableHeader columns={columns}>
                            {(column) => <TableColumn width={column.key !== 'actions' ? `100%` : undefined}
                                                      key={column.key}>{column.label}</TableColumn>}
                        </TableHeader>
                        <TableBody items={data?.items}>
                            {(item) => (
                                <TableRow key={item.id}>
                                    {(columnKey) => <TableCell
                                        align={columnKey === 'actions' ? 'left' : 'right'}
                                    >
                                        {renderCell(item, columnKey.toString())}
                                    </TableCell>
                                    }
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Loading>
                <div className="flex gap-3">
                    <Button
                        className="bg-foreground text-background"
                        endContent={<PlusIcon/>}
                        size="sm"
                        onClick={() => router.push('classifications/adding')}
                    >
                        Add New
                    </Button>
                </div>
            </main>
        </div>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Error on delete</ModalHeader>
                            <ModalBody>
                                <p>
                                    Classification in use.
                                </p>
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
        </>
    )
        ;
}


