import React from 'react'

const ProductDescription = () => {
  return (
    <div className='mt-20'>
        <div className='flex gap-3 mb-4'>
            <button className='btn_dark_rounded !rounded-none !text-xs !py-[6px] w-36'>Description</button>
            <button className='btn_dark_outline !rounded-none !text-xs !py-[6px] w-36'>Care Guide</button>
            <button className='btn_dark_outline !rounded-none !text-xs !py-[6px] w-36'>Size Guide</button>
        </div>
        <div className='flex flex-col pb-16'>
            <p className='text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium nulla necessitatibus sit.
                 Id magnam nostrum iusto facere aut cum, enim sed ad recusandae ipsum, veniam totam quos quisquam
                  corporis praesentium.</p>
            <p className='text-sm'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus quia adipisci neque enim explicabo
                 alias cupiditate labore consequatur beatae quo veritatis consequuntur, excepturi dolor eveniet aliquid
                  atque ratione accusantium unde.</p>
        </div>
    </div>
  )
}

export default ProductDescription
