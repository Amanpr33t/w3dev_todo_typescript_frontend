import React, { Fragment, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AlertModal from './AlertModal';
import Spinner from './Spinner';
import { useNavigate } from 'react-router-dom';

interface AlertType {
    isAlertModal: boolean,
    alertType: 'success' | 'warning' | null,
    alertMessage: string | null,
    routeTo: string | null
}

const AddToDo: React.FC = () => {
    const navigate = useNavigate()
    const [alert, setAlert] = useState<AlertType>({
        isAlertModal: false,
        alertType: null,
        alertMessage: null,
        routeTo: null
    })

    const [spinner, setSpinner] = useState<boolean>(false) //State manages spinner

    const [about, setAbout] = useState<string>('') //Stores value of 'about' typed by user in textarea
    const [aboutLengthError, setAboutLengthError] = useState<boolean>(false) //Is set to true when 'about' has a length of more than 300 alphabets

    const [completionDate, setCompletionDate] = useState<Date | null>(null) //stores completion date selected by the user

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to today

    //Function is triggered when the form is submitted
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!about.trim() || about.trim().length > 300 || !completionDate) {
            if (about.trim().length > 300) {
                setAboutLengthError(true)
            }
            return
        }
        try {
            setSpinner(true)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/todo/add`, {
                method: 'POST',
                body: JSON.stringify({
                    about, completionDate
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
                setSpinner(false)
                setAlert({
                    isAlertModal: true,
                    alertType: 'success',
                    alertMessage: "Todo has been successfully added",
                    routeTo: '/'
                })
            }
        } catch (error) {
            setSpinner(false)
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: "Some error occured",
                routeTo: null
            })
            return
        }
    };

    return (
        <Fragment>

            {alert.isAlertModal &&
                <AlertModal
                    message={alert.alertMessage}
                    type={alert.alertType}
                    routeTo={alert.routeTo}
                    alertModalRemover={() => {
                        setAlert({
                            isAlertModal: false,
                            alertType: null,
                            alertMessage: null,
                            routeTo: null
                        })
                    }} />}

            {spinner && <Spinner />}


            <div className='fixed w-full top-20 pt-2 pb-2 pl-2 z-20 '>
                {/*A button that navigates user back to the home page */}
                <button type='button' className="bg-green-500 text-white font-semibold rounded pl-2 pr-2 h-8" onClick={() => navigate('/', { replace: true })}>Back</button>
            </div>

            <div className={`bg-gray-100 min-h-screen pt-32 ${alert.isAlertModal || spinner ? 'blur' : ''}`}>
                <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
                    <h2 className="text-2xl font-semibold mb-6">Add a todo</h2>

                    <form onSubmit={handleSubmit}>

                        <div className="mb-4">
                            <label htmlFor="about" className="block text-gray-700 text-sm font-bold mb-2">
                                About
                            </label>
                            <textarea
                                id="about"
                                name="about"
                                value={about}
                                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                                    if (about.trim().length > 300 && !aboutLengthError) {
                                        setAboutLengthError(true)
                                    } else if (about.trim().length <= 300 && aboutLengthError) {
                                        setAboutLengthError(false)
                                    }
                                    setAbout(event.target.value)
                                }}
                                rows={4}
                                className='w-full px-3 py-2 rounded-md resize-none focus:outline-none focus:ring focus:border-blue-500 border border-gray-300'
                                placeholder="Enter about"
                            />
                            {aboutLengthError && <p className='text-red-500'>About should be less than 300 alphabets</p>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="selectedDate" className="block text-gray-700 text-sm font-bold mb-2">
                                Select Date
                            </label>
                            <DatePicker
                                selected={completionDate}
                                onChange={(date: Date) => setCompletionDate(date)}
                                dateFormat="MMMM d, yyyy"
                                minDate={today}
                                className='w-full px-3 py-2  rounded-md focus:outline-none focus:ring focus:border-blue-500 border border-gray-300'
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-500 '
                                disabled={spinner}
                            >
                                Submit
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </Fragment>
    );
};

export default AddToDo;