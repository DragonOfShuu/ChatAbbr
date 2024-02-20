
export const getKey = async (key: string) => {
    let returnable =  await chrome.storage.local.get(key);
    if (key in returnable)
        return returnable[key];

    throw new Error("Key does not exist")
}

export const setKey = async (key: string, value: any) => {
    return await chrome.storage.local.set({[key]: value});
}

export const getKeySync = (key: string) => {
    let returnable: any;
    chrome.storage.local.get(key).then((value) => returnable = value);
    if (key in returnable)
        return returnable[key];

    throw new Error("Key does not exist")
}

export const setKeySync = (key: string, value: any) => {
    chrome.storage.local.set({[key]: value}).then();
}
