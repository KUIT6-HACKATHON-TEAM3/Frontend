import leftArrow from '@/assets/icons/green-arrow-left.svg'
import Button from '../components/Button'

export default function Feedback() {
    return (
        <div className="bg-primary-100 pt-11">
            <div className='flex flex-row justify-center item-center font-bold text-[20px] relative'>
                <img src={leftArrow} className='absolute left-6 top-[3px]'/>
                피드백
            </div>
            <div>
                <div>여유로운 산책을 마쳤어요</div>
                <div>오늘 걸었던 길은 마음에 드셨나요?</div>

            </div>
            <div className='p-6'><Button text='전송' /></div>
        </div>
    )
}