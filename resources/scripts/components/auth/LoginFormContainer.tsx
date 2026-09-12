import React, { forwardRef } from 'react';
import { Form } from 'formik';
import styled from 'styled-components/macro';
import { breakpoint } from '@/theme';
import FlashMessageRender from '@/components/FlashMessageRender';
import tw from 'twin.macro';

type Props = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    title?: string;
};

const Container = styled.div`
    ${breakpoint('sm')`
        ${tw`w-4/5 mx-auto`}
    `};

    ${breakpoint('md')`
        ${tw`p-10`}
    `};

    ${breakpoint('lg')`
        ${tw`w-3/5`}
    `};

    ${breakpoint('xl')`
        ${tw`w-full`}
        max-width: 700px;
    `};
`;

export default forwardRef<HTMLFormElement, Props>(({ title, ...props }, ref) => (
    <Container>
        {title && (
            <h2 className='nightshift-auth-title' css={tw`text-3xl text-center text-neutral-100 font-medium py-4`}>
                {title}
            </h2>
        )}
        <FlashMessageRender css={tw`mb-2 px-1`} />
        <Form {...props} ref={ref}>
            <div className='nightshift-auth-card' css={tw`w-full shadow-lg rounded-lg p-6 mx-1`}>
                <div className='nightshift-auth-brand'>
                    <span className='nightshift-auth-mark' aria-hidden='true'>
                        ↯
                    </span>
                    <div>
                        <strong>nightshift</strong>
                        <span>SERVER COMMAND</span>
                    </div>
                </div>
                <div className='nightshift-auth-fields'>{props.children}</div>
            </div>
        </Form>
        <p className='nightshift-auth-footer' css={tw`text-center text-neutral-500 text-xs mt-4`}>
            Nightshift by Trashcore&nbsp;&copy; 2026
        </p>
    </Container>
));
