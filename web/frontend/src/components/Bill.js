import React from 'react';

function Bill(props) {
    return (
        <div className="bg-white p-3 rounded-md">
            <h1 className="text-2xl font-bold">{props.bill.title}</h1>
            <p className="text-xl font-bold">${props.bill.amount}</p>
            <p className="text-xl font-bold">{props.bill.start.toISOString()}</p>
        </div>
    );
}

export default Bill;