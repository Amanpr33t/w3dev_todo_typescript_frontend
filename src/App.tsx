import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import ListOfToDos from "./components/ListOfAllTodos";
import AddToDo from "./components/AddToDo";
import { Route, Routes, Navigate } from "react-router-dom";
import './index.css';

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />}></Route>
        <Route path='/list-of-todos' element={<ListOfToDos />}></Route>
        <Route path='/add-todo' element={<AddToDo />}></Route>
        <Route path='*' element={<Navigate replace to='/' />}></Route>
      </Routes>
    </>
  );
}

export default App;