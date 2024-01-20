import { Fragment, useState } from "react"
import Tooltip from "./Tooltip";
import formatDate from "../utils/dateFunctions";
import { capitalizeFirstLetter } from "../utils/stringFunctions";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface propsType {
    todo: {
        _id: string,
        about: string,
        completionStatus: 'delayed' | 'pending' | 'completed',
        completionDate: Date,
        createdAt: Date
    },
    alertSetter: () => void
}

//This component is a card to show todo data
const ToDoCard: React.FC<propsType> = ({ todo, alertSetter }) => {
    const { _id, about, completionDate, completionStatus, createdAt } = todo

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to start of the day

    const [selectedDate, setSelectedDate] = useState<Date>(new Date(completionDate)) //Date selected by the user to update last date of completing todo

    const [status, setStatus] = useState<'pending' | 'completed' | 'delayed'>(completionStatus) //Status of todo

    //Function used to update completed date of a todo
    const editCompletionDate = async (updatedDate: Date) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/todo/edit-date`, {
                method: 'PATCH',
                body: JSON.stringify({
                    _id,
                    completionDate: updatedDate,
                    completionStatus
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            if (data.status === 'ok') {
                setSelectedDate(updatedDate)
                setStatus('pending')
            }
        } catch (error) {
            alertSetter()//alert modal is shown if an error occurs
            return
        }
    }

    //Function used to update completion status of a todo
    const editCompletionStatus = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/todo/edit-status/${_id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            if (data.status === 'ok') {
                setStatus('completed')
            }
        } catch (error) {
            alertSetter()//alert modal is shown if an error occurs
            return
        }
    }

    return (
        <Fragment>
            <div className='w-11/12 sm:w-10/12 md:w-8/12 lg:w-6/12 p-5 rounded-lg bg-white '>

                <p className="text-lg font-semibold text-gray-700 mb-5">{about}</p>

                <div className="flex flex-row gap-5 mb-2">
                    <p className="text-lg font-semibold text-gray-700">Added on:</p>
                    <p className="text-lg">{formatDate(createdAt.toString())}</p>
                </div>

                {status !== 'completed' &&
                    <div className="flex flex-row gap-5 mb-2">
                        <p className="text-lg font-semibold text-gray-700 mr-1.5 mt-1">Last date:</p>
                        <div className="relative flex flex-row gap-2">
                            <Tooltip text="Edit date">
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={(date: Date) => {
                                        editCompletionDate(date)
                                    }}
                                    dateFormat="MMMM d, yyyy"
                                    minDate={today}
                                    className='w-full px-3 py-2  rounded-md focus:outline-none focus:ring focus:border-blue-500 border border-gray-300 cursor-pointer'
                                />
                            </Tooltip>
                        </div>
                    </div>}

                <div className="flex flex-row gap-5 pb-3 ">
                    <p className="text-lg font-semibold text-gray-700 mr-7">Status:</p>
                    <p className={`text-lg font-semibold pr-2 pl-2 rounded ${status === 'pending' && 'text-orange-500'} ${status === 'completed' && 'text-green-500'} ${status === 'delayed' && 'text-red-600'}`}>{capitalizeFirstLetter(status)}</p>
                </div>

                {status !== 'completed' &&
                    <div className="flex justify-end">
                        <button
                            type='button'
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg rounded px-2 py-1 relative"
                            onClick={editCompletionStatus}
                        >
                            Update status to completed
                        </button>
                    </div>
                }
                
            </div>
        </Fragment >
    )
}
export default ToDoCard