import React, { useEffect } from 'react'
import { useState } from 'react';
// import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

import { Container, Draggable } from "react-smooth-dnd";


let twoArray = ['name','number']

interface why {
    setData:(e:any) => void
}

function TestBoard(setData:why) {

    const changeData = setData
  const [list, setList] = useState<any>([])

  const [newList, setNewList] = useState('')

  const [individualCard, setIndividualCard] = useState({})

  const [cardName, setCardName] = useState('')

  const [dragLeave, setDragLeave] = useState(0)

  const [dragEnter, setDragEnter] = useState(0)

  const [payLoad, setPayLoad] = useState({})


  const insertData = (index:number, name:string) => { 
    let localList = [...list];
    console.log(index,name)

    localList[index].cards.push({
      cardId:`${Date.now()+Math.floor(Math.random() * 10000)}`,
      title:name,
      desc:'',
      due_date:''
    })

    localList[index].temp_Card = ''

    setList(localList)

    setCardName('')

  }

  const createList = () => {

    if(newList){
      setList(() => [...list,{
        name:newList,
        id:`${Date.now()+Math.floor(Math.random() * 10000)}`,
        temp_Card:'',
        cards:[]
      }])

    }
    setNewList('')
  }

  const onColumnDrop = (dropResult:any, arr:any) => {
    // console.log('drop',dropResult)


    let newLists:any = [...arr]

    // console.log('list',newLists)
    newLists = applyDrag(newLists, dropResult)

    // console.log('new = ',newLists)

    setList(newLists)
  }

  const onCardDrop = (e:any,id:number, columnID:number) => {
    // console.log('cards',e)

//     if((e.removedIndex != null || e.addedIndex != null )&& dragEnter == dragLeave){
//         let newLists:any = [...list]

//         let newCards = newLists[id].cards

//         newCards = applyDrag(newLists[id].cards, e)

//         newLists[id].cards = newCards

//         setList(newLists)
//     }

//     if(e.removedIndex != null || e.addedIndex != null ){
//         // console.log('inside here',e)

//         // alert(`${dragEnter} == ${dragLeave}`)

//         let newLists = [...list]

//         // let cuLeave = newLists[dragLeave].cards
// // 
//         let currentList = newLists.find(e => e.id == id)

//         // let newCards = currentList.cards

//         // newCards = applyDrag(newCards, e)

//         // currentList.cards = newCards

//         currentList.cards = applyDrag(currentList.cards, e, payLoad)

//         // if(newLists[id].cards.length != currentList.cards.length){
//         //   newLists[id] = currentList
//         // }

//         // console.log('cu',currentList.cards)

//         // setList(newLists)

//     }

    if(e.removedIndex != null || e.addedIndex != null){

      // alert('in')
      let newColumns = [...list]

      // let currentColumn = newColumns.find(col => col.id == id)

      // currentColumn.cards = applyDrag(currentColumn.cards, e)

      let newCards = newColumns[id].cards

              newCards = applyDrag(newColumns[id].cards, e)
      
              newColumns[id].cards = newCards

      setList(newColumns)
    }
  }

  // useEffect(() => {
  //   if(list.length > 0){
  //       localStorage.setItem("LocalList",JSON.stringify(list))
  //       // setData(list)

  //   }
  // },[list])

  // useEffect(() => {
  //   const data = localStorage.getItem("LocalList")

  //   if(data){
  //       setList(JSON.parse(data))
  //       // setData(JSON.parse(data))
  //   }
  // },[])


  return (
    <div className='Board'>
        <div className="TopBar">
            <input type="text" name="newList" id="newList" value={newList} onChange={(e:React.ChangeEvent<HTMLInputElement>) => setNewList(e.target.value)}/>
            <button type="button" className='AddList' onClick={createList}>add</button>
        </div>
        <div className="MainBoard">
        <Container 
             orientation="horizontal"
             onDrop={(dropResult) => onColumnDrop(dropResult,list)}
            //  getChildPayload={index => list[index]}
            //  dragHandleSelector=".column-drag-handle"
             dropPlaceholder={{
               animationDuration: 150,
               showOnTop: true,
               className: 'cards-drop-preview'
             }}
        >
            {list.map((e:any, idx:number) => 
                (
                <>
                  <Draggable key={e.id}>
                        <div
                            className={`Board_Todos`}
                            key={e.id}
                        >
                            <div className="Heading_Bar">
                                <h1>{e.name}</h1>
                            </div>
                            <div className="BottomBar">
                                {/* <input type="text" value={e.temp_Card} onChange={(ev) => setList((prevItems:any) => {
                                    return prevItems.map((item:any) => {
                                        if (item.id === e.id) {
                                            return { ...item, temp_Card: ev.target.value };  // Spread operator creates a copy
                                        } else {
                                            return item; // Keep the other items unchanged
                                        }
                                    })
                                })}/> */}
                                 <input type="text" value={cardName} onChange={(ev) => setCardName(ev.target.value)}/>
                                <button onClick={() => insertData(idx,cardName)}>+</button>
                            </div>
                            <div className='Bottom_Cards'>
                            <Container
                                // {...e.props}
                                groupName="col"
                                // onDragStart={e => console.log("drag started", e)}
                                // onDragEnd={e => console.log("drag end", e)}
                                // onDrop={(dropResult) => onCardDrop(dropResult,idx,e.id)}
                                // getChildPayload={index => setPayLoad(e.cards[index])}
                                // dragClass="card-ghost"
                                // dropClass="card-ghost-drop"
                                onDragEnter={() => {
                                    setDragEnter(e.id)
                                console.log("drag enter:", e.name);
                                }}
                                onDragLeave={() => {
                                    setDragLeave(e.id)
                                console.log("drag leave:", e.name);
                                }}
                                // onDropReady={p => console.log('Drop ready: ', p)}
                                dropPlaceholder={{                      
                                    animationDuration: 150,
                                    showOnTop: true,
                                    className: 'drop-preview' 
                                }}
                                dropPlaceholderAnimationDuration={200}
                            >
                                {
                                    e.cards && e.cards.map((val:any, index:number) => {
                                        return(
                                            <>
                                            <Draggable key={val.cardId}>
                                                <div 
                                                    className="Individual_Sub_Cards">
                                                    <div className="TopBar_Cards">
                                                      <h1></h1>
                                                      <div className="Card_Buttons">
                                                        <button>
                                                          <img src="../assets/delete.svg" alt="" />
                                                        </button>
                                                        <button></button>
                                                      </div>
                                                    </div>
                                                    <div className="BottomBar_Cards"></div>
                                                </div>
                                            </Draggable>
                                            </>
                                        )
                                    })
                                }
                                </Container>
                            </div>
                        </div>
                    </Draggable>
                </>
                )
            )}
            </Container>
        </div>
    </div>
  );
}

export default TestBoard



export const applyDrag = (arr:any, dragResult:any) => {
    const { removedIndex, addedIndex, payload } = dragResult;
    if (removedIndex === null && addedIndex === null) return arr;
  
    const result = [...arr];

    let itemToAdd = payload;

    console.log('inside',arr, itemToAdd)

  
    if (removedIndex !== null) {
      itemToAdd = result.splice(removedIndex, 1)[0];
    //   console.log('upper',result)

    }
  
    if (addedIndex !== null) {
      result.splice(addedIndex, 0, itemToAdd);

      // console.log('lower',result)
    }
  
    // console.log('res before return',result)
    return result;
  };