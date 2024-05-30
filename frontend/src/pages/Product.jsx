import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useParams } from 'react-router-dom'
import { ProductHd, ProductDisplay, ProductDescription, RelatedProducts } from '../components'

const Product = () => {
  const {all_products} = useContext(ShopContext)
  const {productId} = useParams()
  const product = all_products.find((e) => e.id === Number(productId))
  if(!product){
    return <div>Product not found</div>
  }
  return (
    <section className='max_padd_container py-28'>
        <div>
          <ProductHd product={product}/>
          <ProductDisplay product={product}/>
          <ProductDescription />
          <RelatedProducts />
        </div>
    </section>
  )
}

export default Product
