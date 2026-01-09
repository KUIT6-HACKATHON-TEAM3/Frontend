interface Props {
    text: string,
    width?: number,
}

export default function Button({
    text,
    width
}: Props) {
    return (
        <button className={`${width ? `w-[${width}px]` : 'w-full'} h-[60px] bg-emphasize-500 text-white rounded-[12px] p-[16px]`}>
            {text}
        </button>
    )
}