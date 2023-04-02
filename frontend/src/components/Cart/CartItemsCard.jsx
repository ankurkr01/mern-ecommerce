import React from 'react'
import { Link } from 'react-router-dom'
import './CartItemsCard.css'

const CartItemsCard = ({item, deleteCartItems}) => {
  return (
    <>
        <div className="CartItemCard">
            <img src={item.image} alt='cart product' />
            <div>
                <Link to={`/product/${item.product}`} >{item.name}</Link>
                <span>{`₹${item.price}`}</span>
                <p onClick={()=>deleteCartItems(item.product)} >Remove</p>

            </div>
        </div>
    </>
  )
}

export default CartItemsCard