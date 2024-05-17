import { FallbackProps } from 'react-error-boundary';
import SpecialButton from '@/components/SpecialButton';

export const AppErrorScreen = (props: FallbackProps) => {
    const error = props.error as Error;
    const errorMessage = `${error.stack}`;

    return (
        <div className='absolute inset-0 flex place-items-center place-content-center bg-rose-950'>
            <div className='p-10 rounded-xl bg-pink-800 flex flex-col text-white gap-4 max-w-full lg:max-w-[50%]'>
                <h1 className='text-3xl'>An Error Has Occurred</h1>
                <p className='text-lg'>{`Please dm on discord @dragonofshuu, or dm me on instagram at logan.of.shuu.`}</p>
                <p className='text-lg'>{`Include all the details of the error. Here is some information about what occurred:`}</p>
                <div className={`overflow-x-auto max-w-full bg-fuchsia-950 rounded-md`}>
                    <pre className='text-white p-3'>
                        {errorMessage}
                    </pre>
                </div>
                <SpecialButton onClick={props.resetErrorBoundary} className='py-2'>
                    Attempt Reloading
                </SpecialButton>
            </div>
        </div>
    );
};
