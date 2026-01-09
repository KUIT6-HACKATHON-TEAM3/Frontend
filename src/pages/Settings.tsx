import profile from '@/assets/icons/profile.svg';
import edit from '@/assets/icons/edit.svg';
import arrowRight from '@/assets/icons/arrow-right.svg';

interface ListElementProp {
    text: string;
}

interface SettingsProp {
    nickname: string;
    id: string;
}

function ListElement({text}: ListElementProp) {
    return (
        <div className="flex flex-row justify-between border-b-2 p-[16px]">
            {text}
            <img src={arrowRight} />
        </div>
    )
}

export default function Settings({nickname, id}: SettingsProp) {
    return (
        <div className="bg-primary-100 pt-[44px]">
            <div className="h-[56px] flex flex-col jusitify-center items-center w-full">Settings</div>
            <div className="flex flex-col jusitify-center items-center gap-[16px]">
                <div className="flex flex-col jusitify-center items-center w-[82px] h-[81.5px]">
                    <img src={profile} />
                    {/* <img src={edit} /> */}
                </div>
                <div>
                    <div className='text-[18px] font-bold'>{nickname}</div>
                    <div className='text-[14px]'>@{id}</div>
                </div>
            </div>
            <div className="px-[16px] py-[24px]">
                <ListElement text='마이페이지'/>
                <ListElement text='관심 길'/>
            </div>
        </div>
    )
}