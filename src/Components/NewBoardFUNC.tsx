import React, { useEffect, useState } from 'react'
import DeleteIcon from '../assets/delete.svg'
import CloseIcon from '../assets/close.svg'

import { Container, Draggable } from "react-smooth-dnd";
// import { applyDrag, generateItems } from "./utils";

const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

const columnNames = ["Lorem", "Ipsum", "Consectetur", "Eiusmod"];

const cardColors = [
  "azure",
  "beige",
  "bisque",
  "blanchedalmond",
  "burlywood",
  "cornsilk",
  "gainsboro",
  "ghostwhite",
  "ivory",
  "khaki"
];
const pickColor = () => {
  let rand = Math.floor(Math.random() * 10);
  return cardColors[rand];
};

interface Props {
  setListData: React.Dispatch<React.SetStateAction<any>>;
  setReset: React.Dispatch<React.SetStateAction<any>>;
  reset:boolean
}

const NewBoardFUNC:React.FC<Props>  = ({setListData,reset,setReset}) => {

    const [listName, setListName] = useState('')

    const [popoverOpen, setPopoverOpen] = useState(false)

    const [editCard, setEditCard] = useState({
        name:'',
        description:'',
        end_date:''
    })

    const [currentID, setCurrentID] = useState({
        columnID:0,
        cardID:0
    })

    const [scene,setScene]:any = useState<any>({
      type: "container",
      props: {
        orientation: "horizontal"
      },
      children: generateItems(1, (i:number) => ({
        id: `column${i}`,
        type: "container",
        name: 'First Task',
        tempName:'',
        props: {
          orientation: "vertical",
          className: "card-container"
        },
        children: generateItems(1, (j:any) => ({
          type: "draggable",
          id: `${i}${j}`,
          props: {
            className: "card",
            // style: { backgroundColor:'green', marginTop:'10px' }
          },
          // data: lorem.slice(0, Math.floor(Math.random() * 30) + 30)+` ID = ${j}`
          // data:`Demo Task`

          data:{
            name:'Demo Task',
            description:'',
            end_date:''
          }
        }))
      }))
    })

    const addNewData = () => {
        let local:any = scene

        // let pData = []

        // console.log(typeof local.children)

        // pData = []
        // local = {
        //   type: "container",
        //   props: {
        //     orientation: "horizontal"
        //   },
        //   children: generateItems(1, (i:number) => ())
        // }

        scene.children.push({
          id: `column${local.children}`,
          type: "container",
          name: listName,
          tempName:'',
          props: {
            orientation: "vertical",
            className: "card-container"
          },
          children: []
        })

        // pData.push(1)

        // console.log('Diidy',scene)

        setScene(scene)

        setListName('')

    }


    const getCardPayload = (columnId:any, index:any) => {
        return scene.children.filter((p:any) => p.id === columnId)[0].children[
          index
        ];
      }
    
    const onColumnDrop = (dropResult:any) => {
        const Local_scene:any = Object.assign({}, scene);
        Local_scene.children = applyDrag(Local_scene.children, dropResult);
        setScene(Local_scene);
      }
    
    const onCardDrop = (columnId:any, dropResult:any) => {
        if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
          const Local_scene:any = Object.assign({}, scene);
          const column = Local_scene.children.filter((p:any) => p.id === columnId)[0];
          const columnIndex = Local_scene.children.indexOf(column);
    
          const newColumn = Object.assign({}, column);
          newColumn.children = applyDrag(newColumn.children, dropResult);
          Local_scene.children.splice(columnIndex, 1, newColumn);
    
        //   this.setState({
            setScene(Local_scene)
        //   });
        }
      }

      const handleChange = (e:any, val:any) => {
        // console.log(e,val)


        const updatedData = { ...scene };
        // Find the child and subChild by sID, and update its name
        updatedData.children.forEach((child:any) => {
          // child.subChildren.forEach((subChild) => {
            if (child.id === val) {
              child.tempName = e; // Update the name dynamically
            }
          // });
        });

        // console.log(updatedData)
    
        // Set the updated data back to the state
        setScene(updatedData);
      }

      const handleAddNewCard = (id:any) => {
        const updatedData = { ...scene };
        // Find the child and subChild by sID, and update its name
        updatedData.children.forEach((child:any) => {
          // child.subChildren.forEach((subChild) => {
            if (child.id === id) {
              child.children.push({
                type: "draggable",
                id: `${id}`,
                props: {
                  className: "card",
                  style: { backgroundColor:'green', marginTop:'10px' }
                },
                data: {
                  name:child.tempName
                }
              })
              child.tempName = ''
            }
        });

  
        setScene(updatedData);
      }

      const DeleteCard = (cid:any,id:number) => {
        // console.log(cid,id)

        let val = {...scene}

        let newArray = val.children[cid].children.filter((obj:any, idx:number) => idx !== id)
        // val = val.children[cid].children.splice(id,1)

        val.children[cid].children = newArray
        
        // console.log(newArray)


        setScene(val)
      }

      const EditCard = (cid:number,id:number) => {
        setPopoverOpen(true)

        setCurrentID({...currentID,columnID:cid,cardID:id})
        let val = {...scene}

        let newArray = val.children[cid].children.filter((obj:any, idx:number) => idx == id)

        console.log(newArray)

        setEditCard({...editCard, name:newArray[0].data.name, description:newArray[0].data.description?newArray[0].data.description:'' , end_date:newArray[0].data.end_date?newArray[0].data.end_date:''})
      }

      const SubmitEditCard = (cid:number,id:number) => {
        setPopoverOpen(true)
        let val = {...scene}

        let newArray = val.children[cid].children.filter((obj:any, idx:number) => idx == id)

        // console.log(newArray)

        newArray[0].data = {...editCard};

        const emptyCard = {
          name:'',
          description:'',
          end_date:''
      }

      setEditCard(emptyCard)

        // console.log(val)

      setScene(val)
      setPopoverOpen(false)


        // setEditCard({...editCard, name:newArray[0].data.name, description:newArray[0].data.description , end_date:newArray[0].data.end_date})
      }

      const onDeleteList = (id:number) => {
        let val = {...scene}


        let newArray = val.children.filter((obj:any, idx:number) => idx !== id)
        // val = val.children[cid].children.splice(id,1)

        val.children = newArray

        setScene(val)
      }


      useEffect(() => {
        // if(scene.children.length > 0){
          localStorage.setItem('sceneLocal',JSON.stringify(scene))
        // }

        setListData(scene)
      },[scene])

      useEffect(() => {
        if(reset){
          setScene({
            type: "container",
            props: {
              orientation: "horizontal"
            },
            children:[]
          })
          setReset(false)
        }
      },[reset])

      // useEffect(() => {
      //   let newScene = localStorage.getItem('sceneLocal')
      //   if(newScene){
      //     setScene(JSON.parse(newScene))
      //   }
      // },[])

  return (
    <div className='Board'>
          <div className="TopBar">
            <input type="text" name="newList" placeholder='Add new Lists' id="newList" value={listName} onChange={(e:React.ChangeEvent<HTMLInputElement>) => setListName(e.target.value)}/>
            <button type="button" disabled={listName?false:true} className='AddList' onClick={addNewData}>add</button>
          </div>
          <div className="card-scene">
          {/* <div className="MainBoard_1"> */}
            <Container
              orientation="horizontal"
              onDrop={onColumnDrop}
              dragHandleSelector=".column-drag-handle"
              dropPlaceholder={{
                animationDuration: 150,
                showOnTop: true,
                className: 'cards-drop-preview'
              }}
            >
              {scene.children ? scene.children.map((column:any,index:number) => {
                return (
                  <Draggable key={column.id}>
                    <div className={column.props.className}>
                      <div className="card-column-header">
                        <div style={{display:'flex', alignItems:'flex-start', gap:'10px'}}>
                        <span className="column-drag-handle">&#x2630;</span>
                          <h3 style={{marginTop:'-3px'}}>{column.name}</h3>
                        </div>
                       <img onClick={() => onDeleteList(index)} src={DeleteIcon} alt="" />
                      </div>

                      <div className="BottomBar">
                            <input type="text" placeholder='Add Cards' value={column.tempName} onChange={(ev) => handleChange(ev.target.value,column.id)}/>
                          <button disabled={column.tempName?false:true} onClick={() => handleAddNewCard(column.id)}>+</button>
                      </div>

                      <Container
                        {...column.props}
                        groupName="col"
                        onDragStart={e => console.log("drag started", e)}
                        onDragEnd={e => console.log("drag end", e)}
                        onDrop={e => onCardDrop(column.id, e)}
                        getChildPayload={index =>
                          getCardPayload(column.id, index)
                        }
                        dragClass="card-ghost"
                        dropClass="card-ghost-drop"
                        onDragEnter={() => {
                          console.log("drag enter:", column.id);
                        }}
                        onDragLeave={() => {
                          console.log("drag leave:", column.id);
                        }}
                        onDropReady={p => console.log('Drop ready: ', p)}
                        dropPlaceholder={{                      
                          animationDuration: 150,
                          showOnTop: true,
                          className: 'drop-preview' 
                        }}
                        dropPlaceholderAnimationDuration={200}
                      >
                        
                        {column.children.length > 0 ? column.children.map((card:any,idx:number) => {
                          return (
                            <>
                               
                            <Draggable key={card?.id}>
                              {card.data.description?(
                                <>
                                <div className='card_withDesc'>
                                  <div className='card_Desc'>
                                    <h3>{card.data.name}</h3>
                                    <div className="CardButtons">
                                      <button>S</button><button>W</button>
                                    </div>
                                  </div>
                                  <div className="card_Description">
                                    <p>{card.data.description}</p>
                                  </div>
                                </div>
                                </>
                              ):(
                              <>
                                <div className='card'>
                                  <h3>{card.data.name}</h3>
                                  <div className="CardButtons">
                                    <button onClick={() => EditCard(index,idx)}>S</button>
                                    <button onClick={() => DeleteCard(index,idx)}>W</button>
                                  </div>
                                </div>
                              </>
                            )}
                            </Draggable>
                            </>
                          );
                        }):'no'}
                      </Container>
                    </div>
                  </Draggable>
                );
              }):'NO data yet'}
            </Container>
          {/* </div> */}
          </div>
          <div className={popoverOpen?"ModalPopoverOpen":'ModalPopoverClose'}>
              <div onClick={() => setPopoverOpen(!popoverOpen)} className="Close_Button">
                <img src={CloseIcon} alt="" />
              </div>
              <div className="EditForm">
                <h2>Edit Card </h2>
                <input type="text" value={editCard.name} onChange={(e:any) => setEditCard({...editCard, name:e.target.value})}/>
                <textarea name="text" value={editCard.description} onChange={(e:any) => setEditCard({...editCard, description:e.target.value})}/>
                <input type='date' value={editCard.end_date} onChange={(e:any) => setEditCard({...editCard, end_date:e.target.value})}/>
                <button onClick={() => SubmitEditCard(currentID.columnID, currentID.cardID)}>SUBMIT</button>
              </div>
          </div>
        </div>
  )

  
}

export default NewBoardFUNC


export const applyDrag = (arr:any, dragResult:any) => {
    const { removedIndex, addedIndex, payload } = dragResult;
    if (removedIndex === null && addedIndex === null) return arr;
  
    const result = [...arr];
    let itemToAdd = payload;
  
    if (removedIndex !== null) {
      itemToAdd = result.splice(removedIndex, 1)[0];
    }
  
    if (addedIndex !== null) {
      result.splice(addedIndex, 0, itemToAdd);
    }
  
    return result;
  };
  
  export const generateItems = (count:any, creator:any) => {
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(creator(i));
    }
    return result;
  };

  // <div className="Individual_Sub_Cards_1">
  //                                 <div className="TopBar_Cards">
  //                                   <h3>{card.data.name}</h3>
                                   
  //                                 </div>
  //                                 {card.data.description?<div className="BottomBar_Cards">
  //                                   {card.data.description}
  //                                 </div>:''}
  //                             </div>
  //                             <div className="Card_Buttons">
  //                                     <button onClick={() => DeleteCard(index,idx)}>
  //                                      D
  //                                     </button>
  //                                     <button onClick={() => EditCard(index,idx)}>
  //                                       E
  //                                     </button>
  //                                   </div>