import { HttpStatus, Injectable } from '@nestjs/common';
import { SubmissionService } from '../submission/submission.service';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { ConfigService } from '@nestjs/config';
import Groq from "groq-sdk";
import { RecordNotFoundException } from '@src/exceptions/record-not-found.exception';
import { ApplicationErrorException } from '@src/exceptions';

@Injectable()
export class ReportService {
    private grok: Groq;

    constructor(
        private submissionService: SubmissionService,
        private configService: ConfigService,
    ) {
        this.grok = new Groq({
            apiKey: this.configService.get('groq.apiKey'),
        })
    }

    async generateAISummary(submissions: any[]): Promise<string> {
        const notePromt =
            'You are an AI assistant tasked with summarizing survey responses.' +
            'Below are the survey submissions containing questions and answers.' +
            'Provide a concise summary (2-3 sentences) of the key insights or trends in the responses.' +
            'Focus on common themes, sentiments, or notable patterns.';

        const data = submissions.map((submission, index) => 
            `Submission ${index + 1}:\n
            ${Object.entries(submission.answers)
                .map(([question, answer]) => `Q: ${question}\nA: ${answer}`)
                .join('\n')}`)
            .join('\n\n');

        const prompt = `
            ${notePromt}
            Submissions:
            ${data}
            Summary:
        `;

        try {
            const response = await this.grok.chat.completions.create({
                model: 'llama3-70b-8192',
                messages: [
                    { role: 'system', content: 'You are a helpful summarization assistant.' },
                    { role: 'user', content: prompt },
                ],
                max_tokens: 150,
                temperature: 0.7,
            });

            return response.choices[0].message.content.trim();
        } catch (error) {
            throw new ApplicationErrorException('E-00007', undefined, HttpStatus.BAD_REQUEST);
        }
    }

    async generateReport(surveyId: number, userId: number): Promise<Buffer> {
        const submissions = await this.submissionService.submissions(surveyId, userId);

        if (!submissions.length) {
            throw new RecordNotFoundException('No submissions found for this survey');
        }
        const survey = submissions[0].survey;

        const aiSummary = await this.generateAISummary(submissions);

        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: [
                        new Paragraph({
                            text: `Survey Report: ${survey.title}`,
                            heading: HeadingLevel.HEADING_1,
                            spacing: { after: 200 },
                        }),
                        new Paragraph({
                            text: 'AI-Generated Summary',
                            heading: HeadingLevel.HEADING_2,
                            spacing: { after: 100 },
                        }),
                        new Paragraph({
                            children: [new TextRun(aiSummary)],
                            spacing: { after: 200 },
                        }),
                        new Paragraph({
                            text: 'Submissions',
                            heading: HeadingLevel.HEADING_2,
                            spacing: { after: 100 },
                        }),
                        ...submissions.flatMap((submission, index) => [
                            new Paragraph({
                                text: `Submission ${index + 1}`,
                                heading: HeadingLevel.HEADING_3,
                                spacing: { after: 100 },
                            }),
                            ...Object.entries(submission.answers).map(
                                ([question, answer]) => [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: `Question: ${question}`,
                                                bold: true,
                                            }),
                                        ],
                                        spacing: { after: 50 },
                                    }),
                                    new Paragraph({
                                        children: [
                                            new TextRun(`Answer: ${answer}`),
                                        ],
                                        spacing: { after: 150 },
                                    }),
                                ],
                            ),
                        ]),
                    ].flat(),
                },
            ],
        });

        return await Packer.toBuffer(doc);
    }
}
