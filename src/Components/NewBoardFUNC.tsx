import React, { Children, useEffect, useState } from 'react'
import DeleteIcon from '../assets/delete.svg'
import CloseIcon from '../assets/close.svg'
import EditIcon from '../assets/edit.svg'

import { Container, Draggable } from "react-smooth-dnd";

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
      children:[]
      // children: generateItems(1, (i:number) => ({
      //   id: `column${i}`,
      //   type: "container",
      //   name: 'First Task',
      //   tempName:'',
      //   props: {
      //     orientation: "vertical",
      //     className: "card-container"
      //   },
      //   children: generateItems(1, (j:any) => ({
      //     type: "draggable",
      //     id: `${i}${j}`,
      //     props: {
      //       className: "card",
      //       // style: { backgroundColor:'green', marginTop:'10px' }
      //     },
      //     // data: lorem.slice(0, Math.floor(Math.random() * 30) + 30)+` ID = ${j}`
      //     // data:`Demo Task`

      //     data:{
      //       name:'Demo Task',
      //       description:'',
      //       end_date:''
      //     }
      //   }))
      // }))
    })

    const addNewData = () => {
        let local:any = {...scene}

        local.children.push({
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

        setScene(local)

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
    
          setScene(Local_scene)
        }
      }

      const handleChange = (e:any, val:any) => {
        const updatedData = { ...scene };
        updatedData.children.forEach((child:any) => {
            if (child.id === val) {
              child.tempName = e;
            }
        });
        setScene(updatedData);
      }

      const handleAddNewCard = (id:any) => {
        const updatedData = { ...scene };
        updatedData.children.forEach((child:any) => {
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
        let val = {...scene}
        let newArray = val.children[cid].children.filter((obj:any, idx:number) => idx !== id)
        val.children[cid].children = newArray
        setScene(val)
      }

      const EditCard = (cid:number,id:number) => {
        setPopoverOpen(true)
        setCurrentID({...currentID,columnID:cid,cardID:id})
        let val = {...scene}
        let newArray = val.children[cid].children.filter((obj:any, idx:number) => idx == id)
        setEditCard({...editCard, name:newArray[0].data.name, description:newArray[0].data.description?newArray[0].data.description:'' , end_date:newArray[0].data.end_date?newArray[0].data.end_date:''})
      }

      const SubmitEditCard = (cid:number,id:number) => {
        setPopoverOpen(true)
        let val = {...scene}
        let newArray = val.children[cid].children.filter((obj:any, idx:number) => idx == id)
        newArray[0].data = {...editCard};
        const emptyCard = {
          name:'',
          description:'',
          end_date:''
        }
        setEditCard(emptyCard)
        setScene(val)
        setPopoverOpen(false)
      }

      const onDeleteList = (id:number) => {
        let val = {...scene}
        let newArray = val.children.filter((obj:any, idx:number) => idx !== id)
        val.children = newArray
        setScene(val)
      }


      useEffect(() => {
        if(scene.children.length > 0){
          localStorage.setItem('sceneLocal',JSON.stringify(scene))
        }

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
          localStorage.removeItem('sceneLocal')
          setReset(false)
        }
      },[reset])

      useEffect(() => {
        let newScene = localStorage.getItem('sceneLocal')
        if(newScene){
          setScene(JSON.parse(newScene))
        }
      },[])

  return (
    <div className='Board'>
          <div className="TopBar">
            <input type="text" name="newList" placeholder='Add new Lists' id="newList" value={listName} onChange={(e:React.ChangeEvent<HTMLInputElement>) => setListName(e.target.value)}/>
            <button type="button" disabled={listName?false:true} className='AddList' onClick={addNewData}>add</button>
          </div>
          <div className="card-scene">
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
                                    <img src={EditIcon} onClick={() => EditCard(index,idx)} style={{width:'25px',cursor:'pointer'}} alt="" />
                                    <img src={DeleteIcon} onClick={() => DeleteCard(index,idx)} style={{width:'25px',cursor:'pointer'}} alt="" />
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
                                      <img src={EditIcon} onClick={() => EditCard(index,idx)} style={{width:'25px',cursor:'pointer'}} alt="" />
                                      <img src={DeleteIcon} onClick={() => DeleteCard(index,idx)} style={{width:'25px',cursor:'pointer'}} alt="" />
                                  </div>
                                </div>
                              </>
                            )}
                            </Draggable>
                            </>
                          );
                        }):'No Cards yet !!'}
                      </Container>
                    </div>
                  </Draggable>
                );
              }):'No Lists yet !!'}
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
