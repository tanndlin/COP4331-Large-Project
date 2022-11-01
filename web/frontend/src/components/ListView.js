import React from 'react';
import Bill from './Bill';
import CreateEvent from './CreateEvent';
import Modal from 'react-modal';
import CalendarControls from './CalendarControls';

function ListView(props) {
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [title, setTitle] = React.useState('');
    const [start, setStart] = React.useState(formatDate(new Date()));
    const [amount, setAmount] = React.useState(0);
    const [currentBill, setCurrentBill] = React.useState(null);

    function formatDate(date) {
        // return date.toISOString().split('T')[0];
        // return date;
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    const customStyles = {
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            zIndex: '1000',
        },
        content: {
            width: '50%',
            height: '50%',
            margin: 'auto',
            display: 'flex',
        },
    };

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);

        setTitle('');
        setStart(formatDate(new Date()));
    }

    function createNew() {
        setTitle('');
        setStart(formatDate(new Date()));

        openModal();
    }

    function pushEvent(event) {
        props.modifyEvents(event, currentBill);
        setCurrentBill(null);
    }

    return (
        <div className="flex h-full">
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
                ariaHideApp={false}
            >
                <CreateEvent
                    events={props.bills}
                    title={title}
                    start={start}
                    amount={amount}
                    setAmount={setAmount}
                    setTitle={setTitle}
                    setStart={setStart}
                    closeModal={closeModal}
                    pushEvent={pushEvent}
                />
            </Modal>

            <div className="flex flex-col container m-auto mb-16">
                <CalendarControls createBill={createNew} bills={props.bills} />
                <article className="container p-4 m-auto min-h-500 max-h-3/4screen bg-yellow-200 p-3 rounded-md overflow-y-scroll">
                    <h1 className="text-2xl font-bold border-black border-b-2 p-1">List</h1>
                    <section id="listView" className="grid gap-4 p-4">
                        {props.bills.map((bill) => (
                            <Bill bill={bill} />
                        ))}
                    </section>
                </article>
            </div>
        </div>
    );
}

export default ListView;