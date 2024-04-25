
const inDevMode = () => {
    // console.log("Process.env: ", process.env.NODE_ENV)
    return process.env.NODE_ENV !== 'production';
}

export default inDevMode;