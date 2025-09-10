import React from 'react';
import { useParams } from 'react-router-dom';
import CartItems from '../components/checkout/CartItems';

export default function Checkout(){
    const {store_id} = useParams();
    return (
        <div>
            <CartItems store_id={store_id} />
        </div>
    );
}