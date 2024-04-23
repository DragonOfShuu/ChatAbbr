
const inDevMode = () => {
    return process.env.NODE_ENV === 'production';
}

export default inDevMode;