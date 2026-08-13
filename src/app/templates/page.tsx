"use client";

import {TemplatesList} from "@/components/TemplatesList";
import {useRouter} from "next/navigation";
import {Button} from "@nextui-org/react";
import {PlusIcon} from "@/components/PlusIcon";
import React from "react";

export default function Home() {
    const router = useRouter();

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start min-w-fullmin-w-full w-full">
               <TemplatesList clickAction={(s) => router.push('surveys/'+s.id)} hasDeleteAction={true} />
                <Button
                    className="bg-foreground text-background"
                    endContent={<PlusIcon/>}
                    size="sm"
                    onClick={() => router.push('surveys/new?template=1')}
                >
                    Add New
                </Button>
            </main>
        </div>
    );
}
