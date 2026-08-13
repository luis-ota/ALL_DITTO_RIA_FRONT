import {NcClassification, Question} from "@/entities/Entities";

export type QuestionRenderColumnInput = {
    item: Question,
    columnKey: string,
    classifications: NcClassification[],
    delete: (item: Question) => void,
    update: (item: Question) => void,
}