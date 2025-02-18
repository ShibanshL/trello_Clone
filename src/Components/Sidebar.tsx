import React, { useEffect, useState } from 'react'

function Sidebar(listData:any) {
  const [listData_Local, setListData]:any = useState({})

  useEffect(() => {
    // setListData(listData)

    console.log(listData.listData)

    // {listData_Local.listData.children.map((e:any) => e.id)}

    // {listData?.listData?.children?.map((e:any) => e.name)}

  },[listData])

  return (
    <div className='SideBar'>
      <h2>Board Details</h2>
      {/* <ul> */}
        {listData?.listData?.children?.map((e:any) => {
              return(
                <>
                  {/* <li> */}
                    <div className="SidebarCards">
                      <h3>{e.name}</h3>
                      {e.children.map((val:any) => {
                        return(
                          <p>
                           - {val.data.name}
                          </p>
                        )
                      })}
                    </div>
                  {/* </li> */}
                </>
              )
            }
          )
        }
      {/* </ul> */}
    </div>
  )
}

export default Sidebar