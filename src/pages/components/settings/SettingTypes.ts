import { ReactNode } from 'react';
import { SettingsType } from '@/database/settingsAPI';
import { SettingsActionType } from '../../SettingsDataContext';

export type SettingsSectionModel = {
    name: string,
    sectionContent: (settings: SettingsType, settingsDispatch: React.Dispatch<SettingsActionType>)=>ReactNode
}

