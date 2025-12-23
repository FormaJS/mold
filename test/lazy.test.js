import { describe, it, expect } from 'vitest';
import { f } from '../src/index.js';

describe('LazySchema (Recursion)', () => {
    it('should allow recursive structures', async () => {
        const node = f.lazy(() =>
            f.object({
                value: f.number(),
                child: f.or([node, f.literal(null)]),
            })
        );

        const validTree = { value: 1, child: { value: 2, child: null } };
        expect((await node.validate(validTree)).valid).toBe(true);
    });
});
