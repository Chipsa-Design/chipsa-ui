import assert from 'node:assert';
import { describe, it } from 'node:test';
import { levelOfDetail } from '../FramesLoaderLOD';

describe('FramesLoaderLod', () => {
    describe('levelOfDetail', () => {
        it('Should populate subsets properly', async () => {
            const res: Partial<Record<number, number[]>> = {};

            await levelOfDetail(
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
                16,
                async ({ level, subset }) => (res[level] = subset),
            );

            assert.deepEqual(res, {
                16: [0, 16],
                8: [0, 8, 16],
                4: [0, 4, 8, 12, 16],
                2: [0, 2, 4, 6, 8, 10, 12, 14, 16],
                1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
            });
        });

        it('Waits for previous subset', async () => {
            const callOrder: number[] = [];
            const delays: Partial<Record<number, number>> = {
                16: 100,
                8: 50,
                4: 30,
                2: 20,
            };

            await levelOfDetail([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], 16, async ({ level }) => {
                return new Promise<void>((resolve) => {
                    setTimeout(() => {
                        callOrder.push(level);
                        resolve();
                    }, delays[level]);
                });
            });

            assert.deepEqual(callOrder, [16, 8, 4, 2, 1]);
        });
    });
});

