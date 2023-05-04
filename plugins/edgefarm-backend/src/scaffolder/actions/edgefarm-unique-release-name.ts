import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { v4 as uuidv4 } from 'uuid';

export const uniqueReleaseNameAction = () => {
  return createTemplateAction<{ value: string }>({
    id: 'edgefarm:release:name:unique',
    schema: {
      input: {
        required: ['value'],
        type: 'object',
        properties: {
          value: {
            type: 'string',
            title: 'Value',
            description: 'The value which will be converted into a valid name',
          },
        },
      },
    },
    async handler(ctx) {
      const result = ctx.input.value.replace(
        /[ &\/\\#,+()$~%.'":*?<>{}]/g,
        '-',
      );
      ctx.output('content', `${result}-${uuidv4()}`);
    },
  });
};
