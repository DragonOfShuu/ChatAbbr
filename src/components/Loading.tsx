// import React from 'react'
import styles from './Loading.module.sass';

type Props = {
    className?: string
}

const LoadingComp = (props: Props) => {
    return (
        <div className={`${props.className??''} flex place-content-center`}>
            <div className={`${styles.loadingCircle}`} />
        </div>
    )
}

export default LoadingComp
