import { ReactNode } from 'react';
import styles from './SpecialButton.module.sass'

export const ToolbarButton = (
    props: { 
        onClick: () => any, 
        Image?: SVGRType, 
        children?: ReactNode
        disabled?: boolean, 
        alt: string, 
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
            <button className={`${props.className??''} ${styles.button} p-1`} disabled={props.disabled} onClick={props.onClick}>
                {
                    props.Image?
                        <props.Image width={width} height={height} stroke="#ffffff" />
                    : props.children
                }
            </button>
        );
};
