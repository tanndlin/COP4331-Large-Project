import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import SideBar from './SideBar';
import Dropdown from 'react-dropdown';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-dropdown/style.css';
import '../App.css';
import CreateBillPopUp from './CreateBillPopUp';
import { sendRequest } from '../common/Requests';

const localizer = momentLocalizer(moment);

export function BigCalendar(props) {
    const [isEdit, setIsEdit] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);
    const [name, setName] = React.useState('');
    const [startDate, setStartDate] = React.useState(formatDate(new Date()));
    const [endDate, setEndDate] = React.useState(formatDate(new Date()));
    const [price, setPrice] = React.useState(0);
    const [currentBill, setCurrentBill] = React.useState(null);
    const [categoryId, setCategoryID] = React.useState(-1);

    function formatDate(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    function handleCalendarClick(e) {
        e.preventDefault();
        if (!e.target.classList.contains('rbc-event-content')) {
            return;
        }

        const month = new Date(
            document.querySelector('.rbc-toolbar-label').innerHTML
        );

        if (e.ctrlKey) {
            const bill = props.bills.find(
                (bill) => bill.name === e.target.innerHTML
            );
            bill.paid = !bill.paid;

            const day = bill.startDate.getDate();
            const paidDate = new Date(
                month.getFullYear(),
                month.getMonth(),
                day,
                1
            );

            const editState = () => {
                const newState = props.bills.map((b) => {
                    if (b.id === bill.id) {
                        return {
                            ...b,
                            lastPaid: paidDate
                        };
                    }

                    return b;
                });

                props.setBills(newState);
            };
            editState();
            return;
        }

        const bill = props.bills.find(
            (bill) => `${bill.name} - ${bill.price}` === e.target.innerHTML
        );
        createEdit(bill);
    }

    function deleteBill() {
        const id = currentBill.billId;
        sendRequest(
            'RemoveBill',
            { billId: id, userId: props.user.userId },
            (_res) => {
                const newState = props.bills.filter((b) => b.billId !== id);
                props.setBills(newState);
                closeModal();
            },
            (err) => {
                console.log('Error deleting bill', err);
            }
        );
    }

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
        setIsEdit(false);

        resetAllValues();
    }

    function resetAllValues() {
        setName('');
        setPrice(0);
        setStartDate(formatDate(new Date()));
        setEndDate(formatDate(new Date()));
        setCurrentBill(null);
        setCategoryID(-1);
    }

    function createEdit(bill) {
        setName(bill.name);
        setStartDate(formatDate(bill.startDate));
        setEndDate(formatDate(bill.endDate));
        setPrice(bill.price);
        setCurrentBill(bill);
        setCategoryID(bill.categoryId);

        setIsEdit(true);
        openModal();
    }

    function createNew() {
        resetAllValues();

        openModal();
    }

    function pushEvent(event) {
        props.modifyEvents(event, currentBill);
        setCurrentBill(null);
    }

    function eventStyleGetter(event, start, _end, _isSelected) {
        return {
            className: event.isPaid.some((d) => d === start) ? 'paid' : 'unpaid'
        };
    }

    // Returns true if date is this month or later
    function billIsCurrent(bill) {
        const { startDate, endDate } = bill;
        const today = new Date();

        if (startDate > today) {
            return false;
        }

        if (endDate.getYear() < today.getYear()) {
            return false;
        }

        return endDate.getMonth() >= today.getMonth();
    }

    return (
        <div className="flex min-h-9/10 mb-5">
            <section className="flex flex-col container m-auto">
                <SideBar isOpen={isOpen}>
                    <CreateBillPopUp
                        {...{
                            user: props.user,
                            name,
                            startDate,
                            endDate,
                            price,
                            categoryId,
                            setCategoryID,
                            setPrice,
                            setName,
                            setStartDate,
                            setEndDate,
                            closeModal,
                            pushEvent,
                            deleteBill,
                            isEdit,
                            categories: props.categories,
                            id: currentBill?.billId
                        }}
                    />
                </SideBar>

                <div
                    className="container m-auto mt-5 min-h-500 bg-[#BBE9E7] bg-opacity-50 p-3 rounded-md"
                    onClick={handleCalendarClick}
                >
                    <header className="flex flex-row justify-between font-bold mb-3 border-black border-b-2 p-1">
                        <h1 className="text-2xl">Bills</h1>

                        <Dropdown
                            options={props.categories.map((c) => {
                                return {
                                    value: c.name,
                                    label: c.name
                                };
                            })}
                            value={
                                props.categories.find(
                                    (c) => c.id === props.categorySortID
                                )?.name
                            }
                            onChange={(e) => {
                                const category = props.categories.find(
                                    (c) => c.name === e.value
                                );
                                props.setCategorySortID(category.id);
                            }}
                            className="dropdown"
                            controlClassName="dropdown-control"
                            menuClassName="dropdown-menu"
                            arrowClassName="dropdown-arrow"
                            placeholderClassName="dropdown-placeholder"
                        />

                        <span className="text-md">
                            <h2 data-testid="billSum">
                                {'Total:  $' +
                                    (Object.entries(props.bills)
                                        .filter(([_key, bill]) =>
                                            billIsCurrent(bill)
                                        )
                                        .reduce(
                                            (acc, [_key, bill]) =>
                                                acc + +bill.price,
                                            0
                                        ) ?? 0) +
                                    ' / month'}
                            </h2>
                        </span>
                    </header>
                    <Calendar
                        localizer={localizer}
                        events={getEventsFromBills(
                            props.bills,
                            props.categorySortID
                        )}
                        startAccessor="start"
                        endAccessor="end"
                        eventPropGetter={eventStyleGetter}
                    />
                    <footer className="border-black border-t-2 p-1 mt-3 flex flex-row gap-4">
                        <input
                            className="px-2 bg-[#189DFD] text-[#EFEDFE] hover:bg-[#3818FD] rounded-md"
                            type="button"
                            value="Add Bill"
                            onClick={createNew}
                        />
                    </footer>
                </div>
            </section>
        </div>
    );
}

export function getEventsFromBills(bills, categorySortID) {
    // Each bill will have multiple events for each pay date
    return bills
        .filter((bill) => {
            if (categorySortID === -1 || bill.categoryId === -1) {
                return true;
            }

            return bill.categoryId === categorySortID;
        })
        .map((bill) => {
            const payDates = [];

            const currentDate = new Date(bill.startDate);
            // Create an event for each pay date
            while (currentDate <= bill.endDate) {
                payDates.push({
                    ...bill,
                    start: new Date(currentDate),
                    end: new Date(currentDate),
                    title: `${bill.name} - ${bill.price}`,
                    allDay: true
                });

                currentDate.setMonth(currentDate.getMonth() + 1);
            }

            return payDates;
        })
        .flat();
}
