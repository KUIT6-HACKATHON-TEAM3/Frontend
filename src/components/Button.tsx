interface Props {
    text: string,
    width?: number,
}

export default function Button({
    text,
    width
}: Props) {
    return (
        <button className={`${width ? `w-[${width}px]` : 'w-full'} h-[60px] bg-primary-500 text-white rounded-[8px]`}>
            {text}
        </button>
    )
}