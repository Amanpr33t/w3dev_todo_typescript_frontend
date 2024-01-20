
import { Fragment} from "react"
import { MdFrontHand } from "react-icons/md";
import { Link } from "react-router-dom";

//This component is the home page 
const HomePage: React.FC = () => {

    return (
        <Fragment>

            <div className="pt-20">
                <div className="mt-8 flex flex-col gap-2 place-items-center ">
                    <div className="flex flex-row place-content-center gap-3">
                        <p className="text-3xl text-gray-700 font-bold">Hi!</p>
                        <MdFrontHand className="text-3xl text-yellow-300 font-bold" />
                    </div>
                    <div className="text-2xl text-gray-500 text-center">Your Task Companion: Making Every Day Manageable</div>
                </div>
                <div className="flex flex-col gap-4 place-items-center mt-12">
                    <Link
                        to='/add-todo'
                        className="bg-green-400 hover:bg-green-500 text-white text-xl font-semibold p-5 rounded"
                    >Add a todo</Link>
                    <Link
                        to='/list-of-todos'
                        className="bg-blue-400 hover:bg-blue-500 text-white p-5 text-xl font-semibold rounded"
                    > Todos previouly added by you</Link>
                </div>
            </div>
        </Fragment>
    )
}
export default HomePage