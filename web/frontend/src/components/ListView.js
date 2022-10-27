import React from 'react';
import Bill from './Bill';

function ListView(props) {
    return (
        <div className="flex h-full">
            <article className="container m-auto min-h-500 bg-yellow-200 p-3 rounded-md">
                <h1 className="text-2xl font-bold border-black border-b-2 p-1">List</h1>
                <section id="listView" className="grid gap-16 p-16">
                    {props.bills.map((bill) => (
                        <Bill bill={bill} />
                    ))}
                </section>
            </article>
        </div>
    );
}

export default ListView;