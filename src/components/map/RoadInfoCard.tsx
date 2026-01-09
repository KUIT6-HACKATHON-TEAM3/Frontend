import emptyHeart from '@/assets/icons/empty-heart.svg';
import fullHeart from '@/assets/icons/full-heart.svg';
import arrowUp from '@/assets/icons/arrow-up.svg'
import Button from '../Button';

interface Props {
    roadName: string,
    sectionName: string,
    isFavorite: boolean,
}

export default function RoadInfoCard({
    roadName,
    sectionName,
    isFavorite
}: Props) {
    return (
        <div className='flex flex-col justify-between bg-primary-100 p-[20px] w-full h-[270px] rounded-t-[10px]'>
            <div className='flex flex-col gap-[20px]'>
                <div className='w-full flex justify-center items-center'><img src={arrowUp}/></div>
                <div className='flex flex-row w-full justify-between items-start'>
                    <div className='flex flex-col gap-[4px]'>
                        <h1 className='text-[27px] font-semibold'>{roadName}</h1>
                        <h3 className='text-[18px]'>{sectionName}</h3>
                    </div>

                    {isFavorite?
                    <img src={fullHeart}/>
                    :
                    <img src={emptyHeart}/>
                }
                </div>
            </div>

            <div>
                <Button text='도착' />
            </div>
        </div>
    )
}