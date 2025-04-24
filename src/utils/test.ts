import { DataSource, QueryRunner } from "typeorm";

export const mockQueryRunner = () =>
    ({
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
            create: jest.fn(),
            insert: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            save: jest.fn(),
        },
    }) as unknown as QueryRunner;

export const mockDataSource = (qr: QueryRunner) => {
    return {
        createQueryRunner: jest.fn().mockReturnValue(qr),
    } as unknown as DataSource;
};
