import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Board from './Board'
import TestBoard from './TestBoard'
import NewBoards from './NewBoard'
import NewBoardFUNC from './NewBoardFUNC'
import notTrello from '../assets/noBgColor.png'
import notTrello_1 from '../assets/not_trello.png'

function Parent() {

  const [listData, setListData]:any = useState({})

  const [reset, setReset] = useState(false)

  return (
    <div className="Parent">
        <div className="Header">
          <div className="HeaderLogo">
            <img src={notTrello} alt="" />
          </div>
          <button onClick={() => setReset(!reset)}>RESET</button>
        </div>
        <div className="Sub_Body">
            <Sidebar listData={listData}/>
            {/* <Board /> */}
            {/* <TestBoard setData={() => setListData}/> */}
            <NewBoardFUNC setListData={setListData} reset={reset} setReset={setReset}/>
        </div>
    </div>
  )
}

export default Parent