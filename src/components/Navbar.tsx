import  { Fragment } from 'react';

//The component is the navigation bar
const Navbar: React.FC = () => {

  return (
    <Fragment>
      <div className='fixed top-0 z-50 h-20 w-full border-b shadow bg-white pl-2 md:pl-12 flex items-center'>
        <p className='font-semibold text-xl text-3xl italic text-gray-600'>ToDoHub</p>
      </div>
    </Fragment>
  );
};

export default Navbar;