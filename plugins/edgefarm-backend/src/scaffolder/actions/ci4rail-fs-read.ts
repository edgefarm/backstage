import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import fs from 'fs-extra';

export const readFileAction = () => {
  return createTemplateAction<{ path: string }>({
    id: 'ci4rail:fs:read',
    schema: {
      input: {
        required: ['path'],
        type: 'object',
        properties: {
          path: {
            type: 'string',
            title: 'Filepath',
            description: 'The filepath of the file that will be read',
          },
        },
      },
    },
    async handler(ctx) {
      const fileBuf = fs.readFileSync(
        `${ctx.workspacePath}/${ctx.input.path}`,
        'utf8',
      );
      ctx.output('content', fileBuf.toString());
    },
  });
};
