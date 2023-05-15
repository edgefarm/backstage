import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import sha1 from 'crypto-js/sha1';

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
      let v = ctx.input.value;
      if (v.indexOf('/') > 0) {
        v = v.slice(v.lastIndexOf('/') + 1);
      }
      const result = v.replace(/[ &\/\\#,+()$~%.'":*?<>{}]/g, '-');
      ctx.output('content', `${result}-${sha1(v).toString().slice(0, 5)}`);
    },
  });
};
