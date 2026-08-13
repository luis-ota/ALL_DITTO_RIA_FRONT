'use client';

import {Escalation, NonConformity} from "@/entities/Entities";
import {
    Button,
    Checkbox, Chip, Input,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Textarea, useDisclosure,
} from "@nextui-org/react";
import React, {useState} from "react";
import getBestContrastColor from "@/functions/getBestContrastColor";
import {format} from "date-fns";
import {updateNC} from "@/functions/nonConformities";
import {PlusIcon} from "@/components/PlusIcon";
import {createEscalation} from "@/functions/escalation";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";

type NonConformityListProps = {
    ncs: NonConformity[],
    setNcs: (ncs: NonConformity[]) => void,
}

export const NonConformityList: React.FC<NonConformityListProps> = ({ncs, setNcs}) => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [ escalationTo, setEscalationTo ] = useState<string>();
    const [ escalating, setEscalating ] = useState<NonConformity>();

    const escalar = async () => {
        let nEscalation: Escalation | null = {
            date: new Date(),
            escalatedTo: escalationTo,
            ncId: escalating?.id,
        } as Escalation;

        nEscalation = await createEscalation(nEscalation);
        if (nEscalation) {
            const ncIndex = ncs.findIndex((x) => x.id === escalating?.id);
            ncs[ncIndex].escalations = ncs[ncIndex].escalations != null ? [...ncs[ncIndex].escalations, nEscalation] : [nEscalation];
            setNcs(ncs);
            setEscalationTo(undefined)
            setEscalating(undefined)
        }
    }

    if (ncs.length === 0) {
        return <p className="font-bold text-inherit">No non-conformities found.</p>;
    }

    const upadateNcResolved = async (r: boolean, nc: NonConformity) => {
        nc.resolved = r;
        nc.lastResolutionDate = new Date();

        const ncUpdated = await updateNC(nc.id, nc);

        if (ncUpdated) {
            const ncIndex = ncs.findIndex((x) => x.id === nc.id);
            ncs[ncIndex] = ncUpdated;
            setNcs(ncs);
        }
    }

    return (
        <>
            <Table aria-label="Non-Conformities">
                <TableHeader>


                    <TableColumn width={30}>Order</TableColumn>
                    <TableColumn width={30}>Artifact</TableColumn>
                    <TableColumn width={200}>Description</TableColumn>
                    <TableColumn width={170}>Corrective Action</TableColumn>
                    <TableColumn width={250}>Notes</TableColumn>
                    <TableColumn width={150}>Responsible</TableColumn>
                    <TableColumn width={200}>Classification</TableColumn>
                    <TableColumn width={100}>Last update</TableColumn>
                    <TableColumn width={30}>Recurrence</TableColumn>
                    <TableColumn width={30}>Resolved</TableColumn>
                    <TableColumn>Escalation</TableColumn>
                </TableHeader>
                <TableBody>
                    {ncs.map((nc) => (
                        <TableRow key={nc.id}>
                            <TableCell>{nc.question.order}</TableCell>
                            <TableCell>{nc.question.artifact}</TableCell>
                            <TableCell><Textarea isDisabled={true} defaultValue={nc.question.description}/></TableCell>
                            <TableCell>{nc.question.correctiveAction}</TableCell>
                            <TableCell><Textarea isDisabled={true} defaultValue={nc.question.notes}/></TableCell>
                            <TableCell>{nc.question.responsible}</TableCell>
                            <TableCell>
                            <span
                                className={'p-1 rounded-md'}
                                style={{
                                    backgroundColor: nc.question.ncClassification?.color,
                                    color: getBestContrastColor(nc.question.ncClassification?.color ?? ''),
                                }}
                            >
                                {nc.question.ncClassification?.name} | {nc.question.ncClassification?.daysToResolve}
                            </span>
                            </TableCell>
                            <TableCell>{nc.lastResolutionDate != null ? format(nc.lastResolutionDate, 'MM/dd/yyyy') : ''}</TableCell>
                            <TableCell><Checkbox isDisabled={true}
                                                 defaultSelected={nc.question.recurrence}/></TableCell>
                            <TableCell><Checkbox onValueChange={(e) => upadateNcResolved(e, nc)}
                                                 defaultSelected={nc.resolved}/></TableCell>
                            <TableCell>
                                <div className={'flex items-center justify-start max-w-xl overflow-auto'}>
                                    <Button
                                        className="text-background"
                                        endContent={<PlusIcon/>}
                                        size="sm"
                                        isIconOnly
                                        onClick={() => {
                                            setEscalating(nc);
                                            onOpen();
                                        }}
                                    />
                                    <div className={'m-2 flex justify-end gap-1 items-center'}>
                                        {
                                            nc.escalations?.sort((a, b) => {
                                                return new Date(b.date).getTime() - new Date(a.date).getTime();
                                            }).map(e => {
                                                return (<Chip> {e.escalatedTo} em {format(e.date, 'MM/dd/yyyy')}</Chip>)
                                            })
                                        }
                                    </div>
                                </div>
                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Escalate</ModalHeader>
                            <ModalBody>
                                <Input value={escalationTo} onChange={(e) => setEscalationTo(e.target.value)}
                                       placeholder="Escalate to" />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={() => { onClose(); escalar() }}>
                                    Escalate
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

