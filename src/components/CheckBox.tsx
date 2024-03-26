import { ChangeEventHandler } from 'react'
import styles from './CheckBox.module.sass'

type Props = {
    text?: string
    CheckboxRef?: React.RefObject<HTMLInputElement>
    onChange?: ChangeEventHandler<HTMLInputElement> | undefined
    checked?: boolean
}

const CheckBox = (props: Props) => {
    return (
        <label className={`${styles.label}`}>
            <input type="checkbox" ref={props.CheckboxRef} className={`${styles.input}`} onChange={props.onChange} checked={props.checked} />
            {/* <span className={`${styles.checkbox}`} /> */}
            {props.text}
        </label>
    )
}

export default CheckBox;
