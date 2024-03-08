import { ReactNode } from 'react';
import styles from './SpecialButton.module.sass'

const SpecialButton = (
    props: { 
        onClick: (e: React.MouseEvent) => any, 
        Image?: SVGRType, 
        children?: ReactNode
        disabled?: boolean, 
        alt?: string, // Note that alt is not currently used
        className?: string, 
        imageClassName?: string,
        width?: number,
        height?: number,
        scale?: number
    }) => {
        const defaultSize = 32
        const width = props.scale??props.width??defaultSize
        const height = props.scale??props.height??defaultSize

        return (
            <button className={`${props.className??''} ${styles.button}`} disabled={props.disabled} onClick={props.onClick}>
                {
                    props.Image?
                        <props.Image width={width} height={height} stroke="#ffffff" />
                    : props.children
                }
            </button>
        );
};

export default SpecialButton