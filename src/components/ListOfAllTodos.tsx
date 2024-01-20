import { Fragment, useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom";
import AlertModal from "./AlertModal"
import Spinner from "./Spinner";
import ToDoCard from "./ToDoCard";
import { capitalizeFirstLetter } from "../utils/stringFunctions";

interface AlertType {
    isAlertModal: boolean,
    alertType: 'success' | 'warning' | null,
    alertMessage: string | null,
    routeTo: string | null
}

interface ToDoType {
    _id: string,
    about: string,
    completionStatus: 'delayed' | 'pending' | 'completed',
    completionDate: Date,
    createdAt: Date
}

//This component is used to show list of all todos
const ListOfToDos: React.FC = () => {
    const navigate = useNavigate()

    const [alert, setAlert] = useState<AlertType>({
        isAlertModal: false,
        alertType: null,
        alertMessage: null,
        routeTo: null
    })
    const [spinner, setSpinner] = useState<boolean>(true)
    const [error, setError] = useState<boolean>(false)

    const [allTodos, setAllTodos] = useState<ToDoType[]>([]) //all the todos fetched from database

    //'completed' | 'delayed' | 'pending' | '' | 'none'
    const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('')

    //This function is used to fetch all todos
    const fetchTodos = useCallback(async () => {
        try {
            setError(false)
            setSpinner(true)
            let url
            if (!selectedStatusFilter || selectedStatusFilter === 'none') {
                url = `${process.env.REACT_APP_BACKEND_URL}/todo/fetchTodos`
            } else {
                url = `${process.env.REACT_APP_BACKEND_URL}/todo/fetchTodos?status=${selectedStatusFilter}`
            }
            const response = await fetch(url, {
                method: 'GET',
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
                setAllTodos(data.allTodos)
            }
        } catch (error) {
            setSpinner(false)
            setError(true)
            return
        }
    }, [selectedStatusFilter])

    useEffect(() => {
        fetchTodos()
    }, [fetchTodos])

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

            {error &&
                //An error message is shown when an error occurs while fetching data
                <div className="absolute top-40 z-50 w-full h-screen flex flex-col place-items-center">
                    <p>Some error occured</p>
                    <button type='button' className="text-red-500" onClick={fetchTodos}>Try again</button>
                </div>
            }

            <div className='fixed w-full top-20 pt-2 pb-2 pl-2 z-20 '>
                {/*a button used to navigate user to home page */}
                <button type='button' className="bg-green-500 text-white font-semibold rounded pl-2 pr-2 h-8" onClick={() => navigate('/', { replace: true })}>Back</button>
            </div>

            {!error &&
                <div className={`${alert.isAlertModal || spinner ? 'blur' : ''} w-full pt-20  bg-gray-200 min-h-screen`}>

                    <div className="pt-5 pb-20  relative flex flex-col place-items-center gap-5">

                        {!allTodos.length && <div role="status" className="font-semibold text-gray-800 md:text-xl text-center ">
                            <p>No todos available</p>
                        </div>}

                        {allTodos.length > 0 && <p className="font-semibold text-gray-800 md:text-xl text-center">{allTodos.length} todos available</p>}

                        <select
                            value={selectedStatusFilter}
                            onChange={(e) => setSelectedStatusFilter(e.target.value)}
                            className="bg-white border border-gray-300 px-2 py-1 rounded-md cursor-pointer"
                        >
                            <option disabled value={''}>Filter by status</option>
                            {['delayed', 'pending', 'completed'].map((status) => (
                                <option key={status} value={status}>
                                    {capitalizeFirstLetter(status)}
                                </option>
                            ))}
                            <option value={'none'}>None</option>
                        </select>

                        {allTodos.length > 0 && allTodos.map(todo => {
                            return <ToDoCard
                                key={todo._id}
                                todo={todo}
                                alertSetter={() => {
                                    setAlert({
                                        isAlertModal: true,
                                        alertType: 'warning',
                                        alertMessage: 'Some error occured',
                                        routeTo: null
                                    })
                                }}
                            />
                        })
                        }
                    </div>
                </div>}

        </Fragment >
    )
}
export default ListOfToDos