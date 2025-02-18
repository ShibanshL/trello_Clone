import React, { useEffect } from 'react'
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';


let twoArray = ['name','number']

const reorder = (list:any, name:string, obj:any, desiredIndex:number) => {
  // const result = Array.from(list);
  // const [removed] = result.splice(startIndex, 1);
  // result.splice(endIndex, 0, removed);

  // return result;

  const currentIndex = list.findIndex((item:any)=> item.name === name);

  // If the object is found and the desired index is different, proceed to swap
  if (currentIndex !== -1 && currentIndex !== desiredIndex) {
    // Remove the object from the current index
    list.splice(currentIndex, 1);
    
    // Insert the object at the desired index
    list.splice(desiredIndex, 0, obj);
  }

  // Return the updated array
  return list
};

function swapObjects(arr:any, index1:number, index2:number) {
  // Check if the indices are valid
  if (index1 < 0 || index1 >= arr.length || index2 < 0 || index2 >= arr.length) {
    console.log("Invalid indices");
    return arr; // Return the original array if the indices are invalid
  }

  let loc = [...arr]
  
  // Swap the objects at index1 and index2
  let temp = loc[index1];
  loc[index1] = loc[index2];
  loc[index2] = temp;

  // [arr[index1], arr[index2]] = [arr[index2], arr[index1]];

  // console.log('ARR ',arr)

  return loc;
}


function Board() {
  const [list, setList] = useState<any>([])

  const [newList, setNewList] = useState('')

  const [individualCard, setIndividualCard] = useState({})

  const [cardName, setCardName] = useState('')

  const [inpNumber, setInpNumber] = useState(0)

  const insertData = (index:number, name:string) => { 
    let localList = list;
    // console.log(localList)

    localList[index].cards.push({
      cardId:`${Date.now()+Math.floor(Math.random() * 10000)}`,
      title:name,
      desc:'',
      due_date:''
    })

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

  const onDragEnd = (result:any) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    let data = [...list];

    let temp = data[parseInt(result.source.index)]

    data[parseInt(result.source.index)] = data[parseInt(result.destination.index)]

    data[parseInt(result.destination.index)] = temp

    // console.log(list,'res')

    // const items = reorder(
    //   list,
    //   result.draggableId,
    //   result.source.index,
    //   result.destination.index
    // );

    // console.log(swapObjects(list, result.source.index,
    //   result.destination.index ))

    // console.log(items)

    setList(data)

    // this.setState({
    //   items,
    // });

    console.log('data',data)
  }

  const onDragEnd1 = (result: DropResult) => {
    const { destination, source } = result;

    console.log(result);

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    let add;
    let active = twoArray;
    let complete = twoArray;
    // Source Logic
    if (source.droppableId === "TodosList") {
      add = active[source.index];
      active.splice(source.index, 1);
    } else {
      add = complete[source.index];
      complete.splice(source.index, 1);
    }

    // Destination Logic
    if (destination.droppableId === "TodosList") {
      active.splice(destination.index, 0, add);
    } else {
      complete.splice(destination.index, 0, add);
    }

    // twoArray = complete
    // setCompletedTodos(complete);
    // setTodos(active);

    // setList(complete)
  };


  

  return (
    <div className='Board'>
      <div className="TopBar">
        <input type="text" name="newList" id="newList" value={newList} onChange={(e:React.ChangeEvent<HTMLInputElement>) => setNewList(e.target.value)}/>
        <button type="button" className='AddList' onClick={createList}>add</button>
      </div>
      {/* <div className="MainBoard"> */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={`TodosList${Date.now() + '-' + Math.floor(Math.random() * 10000)}`} direction="horizontal">
          {(provided, snapshot) => (
            <div
            className="MainBoard"
            // id="TodosList"
              ref={provided.innerRef}
              {...provided.droppableProps}
              >
                {list.map((e:any, idx:number) => 
                  (
                    <>
                      <Draggable key={e.id} draggableId={e.id} index={idx}>
                      {(provided, snapshot) => (
                        //  <DragDropContext onDragEnd={onDragEnd}>
                            <div
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            className={`Board_Todos`}
                          
                          >
                            <div className="Heading_Bar">
                              <h1>{e.name}</h1>
                            </div>
                            <div className="BottomBar">
                              <input type="text" value={cardName} onChange={(ev) => setCardName(ev.target.value)}/>
                              <button onClick={() => insertData(idx,cardName)}>+</button>
                            </div>
                            {/* <div className='Bottom_Cards'> */}
                              <DragDropContext onDragEnd={() => {}}>
                              <Droppable droppableId={`LowerCards${Date.now() + '-' + Math.floor(Math.random() * 10000)}`}>
                                {(provided, snapshot) => (
                                  <div className='Bottom_Cards'>
                                    {
                                    e.cards.map((val:any, index:number) => {
                                      return(
                                        <>
                                        <Draggable key={val.cardId} draggableId={val.cardId} index={index}>
                                        {(provided, snapshot) => (
                                          <div 
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          ref={provided.innerRef}
                                          className="Individual_Sub_Cards">
                                            {val.title}
                                          </div>
                                        )}
                                        </Draggable>
                                          
                                        </>
                                      )
                                    })
                                    }</div>
                                )}
                                {/* {} */}
                              </Droppable>
                              </DragDropContext>
                            {/* </div> */}
                          </div>
                      )}
                      </Draggable>
                    </>
                  )
                )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {/* </div> */}
    </div>
  );
}

export default Board