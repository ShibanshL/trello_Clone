import React, { useState } from 'react'
import Sidebar from './Sidebar'
import NewBoardFUNC from './NewBoardFUNC'
import notTrello from '../assets/noBgColor.png'
import githubIcon from '../assets/github.png'

function Parent() {

  const [listData, setListData]:any = useState({})

  const [reset, setReset] = useState(false)

  return (

    <>
    <div className="Parent">
        <div className="Header">
          <div className="HeaderLogo">
            <img src={notTrello} alt="" />
          </div>
          <div className="HeaderButtons">
          <button  onClick={() => setReset(!reset)}>RESET</button>
             <a href="https://github.com/ShibanshL/trello_Clone"><img src={githubIcon} alt="" /></a> 
          </div>
          
        </div>
        <div className="Sub_Body">
            <Sidebar listData={listData}/>
            <NewBoardFUNC setListData={setListData} reset={reset} setReset={setReset}/>
        </div>
    </div>
    <div className="MobileScreen">
      <h1>Responsive screens WIP !</h1>
    </div>
    </>
  )
}

export default Parent