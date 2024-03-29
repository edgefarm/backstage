import { createTemplateAction } from '@backstage/plugin-scaffolder-node';

export const edgefarmApplicationsCommandTokenize = () => {
    return createTemplateAction<{ inputString: string }>({
        id: 'edgefarm:applications:command:tokenize',
        schema: {
            input: {
                required: ['inputString'],
                type: 'object',
                properties: {
                    inputString: {
                        type: 'string',
                        title: 'Input String',
                        description: 'The string which will be tokenized',
                    },
                },
            },
            output: {
                type: 'object',
                properties: {
                    tokenizedData: {
                        type: 'array',
                        title: 'Tokenized Data',
                    },
                },
                required: ['tokenizedData'],
            },
        },

        async handler(ctx) {
            const inputStr = (ctx.input.inputString || "").trim();

            if (typeof inputStr !== 'string') {
                throw new Error('Required parameter "inputString" is not a string');
            }

            // function to split string
            function tokenize(str: string) {
                return str.match(/(?:[^\s"]+|"[^"]*")+/g);
            }

            const tokenizedData = tokenize(inputStr);
            const quotedTokens = (tokenizedData || []).map(token => `"${token}"`);

            ctx.output('tokenizedData', quotedTokens);
        },
    });
};
