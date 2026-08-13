import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {QuestionStatus} from "@/enums/QuestionStatus";

@Entity()
export class Survey {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ default: false })
    public template: boolean;

    @Column({
        length: 255,
    })
    public name: string;

    @Column('date')
    public date?: Date;

    @Column({
        length: 255,
    })
    public responsible?: string;

    @Column({
        length: 255,
    })
    public objectName?: string;

    @Column({
        length: 255,
    })
    public objectUrl?: string;

    public update(survey: Survey): void {
        this.name = survey.name;
        this.date = survey.date;
        this.template = survey.template;
        this.responsible = survey.responsible;
        this.objectName = survey.objectName;
        this.objectUrl = survey.objectUrl;
    }

    constructor(survey?: Survey) {
        this.name = survey?.name ?? '';
        this.date = survey?.date;
        this.template = survey?.template ?? false;
        this.responsible = survey?.responsible;
        this.objectName = survey?.objectName;
        this.objectUrl = survey?.objectUrl;
    }
}

@Entity()
export class NcClassification {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({
        length: 255,
    })
    public name: string;

    @Column({
        length: 50,
    })
    public color: string;

    @Column()
    public order: number;

    @Column()
    public daysToResolve: number;

    public update(classification: NcClassification): void {
        this.name = classification.name;
        this.color = classification.color;
        this.order = classification.order;
        this.daysToResolve = classification.daysToResolve;
    }
}

@Entity()
export class Question {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({
        length: 450,
    })
    public description: string;

    @Column({
        type: 'enum',
        enum: QuestionStatus,
        default: QuestionStatus.Empty
    })
    public status: QuestionStatus = QuestionStatus.Empty;

    @Column({
        length: 255,
    })
    public responsible: string;

    @Column({ default: false })
    public recurrence: boolean;

    @Column({
        length: 450,
    })
    public notes: string;

    @Column({
        length: 450,
    })
    public correctiveAction: string;

    @Column({
        length: 255,
    })
    public artifact: string;

    @Column('uuid')
    public ncClassificationId?: string | null;
    @ManyToOne(() => NcClassification)
    @JoinColumn({ name: 'ncclassificationid' })
    public ncClassification?: NcClassification;

    @Column('uuid')
    public surveyId: string;
    @ManyToOne(() => Survey)
    public survey: Survey;

    @Column()
    public order: number;

    public update(question: Question): void {
        this.description = question.description;
        this.status = question.status;
        this.responsible = question.responsible;
        this.recurrence = question.recurrence;
        this.notes = question.notes;
        this.correctiveAction = question.correctiveAction;
        this.artifact = question.artifact;
        this.ncClassificationId = question.ncClassificationId;
        this.surveyId = question.surveyId;
        this.order = question.order;
    }

    constructor(question?: Question) {
        this.description = question?.description ?? '';
        this.status = QuestionStatus.Empty;
        this.responsible = question?.responsible ?? '';
        this.recurrence = question?.recurrence ?? false;
        this.notes = question?.notes ?? '';
        this.correctiveAction = question?.correctiveAction ?? '';
        this.artifact = question?.artifact ?? '';
        this.ncClassificationId = question?.ncClassificationId ?? undefined;
        this.surveyId = question?.surveyId ?? '';
        this.order = question?.order ?? 0;
    }
}
@Entity()
export class NonConformity {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column('date')
    public finalResolutionDate?: Date;

    @Column('date')
    public lastResolutionDate?: Date;

    @Column({ default: false })
    public resolved: boolean;

    @Column('uuid')
    public questionId: string;
    @OneToOne(_ => Question)
    @JoinColumn({ name: 'questionid' })
    public question: Question;

    @OneToMany(() => Escalation, escalation => escalation.nonConformity)
    public escalations: Escalation[];

    constructor() {
        this.resolved = false;
    }

    public update(nonConformity: NonConformity): void {
        this.finalResolutionDate = nonConformity.finalResolutionDate;
        this.lastResolutionDate = nonConformity.lastResolutionDate;
        this.resolved = nonConformity.resolved;
        this.questionId = nonConformity.questionId;
    }
}

@Entity()
export class Escalation {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column('date')
    public date: Date;

    @Column({
        length: 255
    })
    public escalatedTo: string;

    @Column('uuid')
    public ncId: string;

    @ManyToOne(() => NonConformity, escalation => escalation.escalations)
    @JoinColumn({ name: 'ncid' })
    public nonConformity: NonConformity;
}